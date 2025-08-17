'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { createClient } from '@supabase/supabase-js'
import { generateUniqueSubdomain } from '@/lib/utils'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateWebsiteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateWebsiteModal({ isOpen, onClose }: CreateWebsiteModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [theme, setTheme] = useState('light')
  const [font, setFont] = useState('Inter')
  const [error, setError] = useState('')
  
  useEffect(() => {
    // Generate default website name and subdomain when user data is available
    if (user && isOpen) {
      const defaultName = `${user.firstName || 'My'}'s Restaurant`
      setName(defaultName)
      generateSubdomain(defaultName)
    }
  }, [user, isOpen])
  
  const generateSubdomain = async (nameVal: string) => {
    const generated = await generateUniqueSubdomain(nameVal.split(' ')[0] || 'restaurant')
    setSubdomain(generated)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !subdomain) {
      setError('Name and subdomain are required')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Update user with website data
      const { data: userData, error } = await supabase
        .from('users')
        .update({
          restaurant_name: name,
          subdomain,
          settings: {
            theme,
            fontFamily: font
          },
          content: {
            navbar: { heading: name, subheading: '', buttons: [] },
            menu: { items: [] },
            chefs: { posts: [] },
            about: { content: '' },
            contact: { email: '', phone: '' },
            gallery: { images: [], captions: {} },
            reviews: []
          },
          is_published: false
        })
        .eq('id', user?.id)
        .select()
        .single()
      
      if (error) throw error
      
      // Redirect to the dashboard
      router.push('/dashboard')
      onClose()
    } catch (error: any) {
      console.error('Error creating website:', error)
      setError(error.message || 'Failed to create website')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Website</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="My Restaurant"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subdomain
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white"
                  placeholder="myrestaurant"
                  required
                />
                <span className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-gray-300">
                  .platter.com
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Font
              </label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Website'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 
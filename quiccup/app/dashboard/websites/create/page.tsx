"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/lib/supabase'

export default function CreateWebsitePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  async function createWebsite() {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      // Update user with website data
      const { data: userData, error } = await supabase
        .from('users')
        .update({
          restaurant_name: 'New Website',
          subdomain: `user-${user.id.slice(0, 8)}`,
          settings: {
            theme: 'light',
            fontFamily: 'Inter'
          },
          content: {
            navbar: { heading: 'New Website', subheading: '', buttons: [] },
            menu: { items: [] },
            chefs: { posts: [] },
            about: { content: '' },
            contact: { email: '', phone: '' },
            gallery: { images: [], captions: {} },
            reviews: []
          },
          is_published: false
        })
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating website:', error)
      alert('Failed to create website. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Website</h1>
      
      <button
        onClick={createWebsite}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Website'}
      </button>
    </div>
  )
} 
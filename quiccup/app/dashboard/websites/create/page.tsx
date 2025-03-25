"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

export default function CreateWebsitePage() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  
  async function createWebsite() {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      // Create website directly tied to user_id
      const { data, error } = await supabase
        .from('websites')
        .insert({
          name: 'New Website',
          user_id: user.id, // Use Clerk user ID directly
          settings: {
            theme: 'light',
            fontFamily: 'Inter'
          },
          sections: {
            hero: { enabled: true },
            menu: { enabled: true, items: [] },
            reviews: { enabled: true, items: [] },
            contact: { enabled: true }
          }
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Redirect to edit page
      router.push(`/dashboard/websites/${data.id}/edit`)
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
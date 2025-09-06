'use client'
import { useAuth } from '@/providers/auth-provider'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ProfileSettings() {
  const { user } = useAuth()
  const [restaurantName, setRestaurantName] = useState('')
  const [tagline, setTagline] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfileData() {
      if (!user) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('users')
          .select('restaurant_name, tagline')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setRestaurantName(data.restaurant_name || '')
          setTagline(data.tagline || '')
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [user])

  const handleSave = async () => {
    if (!user) return

    try {
      setIsSaving(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('users')
        .update({
          restaurant_name: restaurantName,
          tagline: tagline,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error
      
      // You could add a success toast here
    } catch (error) {
      console.error('Error saving profile:', error)
      // You could add an error toast here
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1">
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm bg-gray-50"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Your email cannot be changed.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
          <div className="mt-1">
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Enter your restaurant name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tagline</label>
          <div className="mt-1">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Enter a catchy tagline for your restaurant"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">A short, memorable phrase that describes your restaurant.</p>
        </div>
      </div>
    </div>
  )
}
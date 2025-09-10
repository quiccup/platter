'use client'
import { useAuth } from '@/providers/auth-provider'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ProfileSettings() {
  const { user } = useAuth()
  const [restaurantName, setRestaurantName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load profile data when component mounts
  useEffect(() => {
    async function loadProfileData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        
        // Query the users table to get restaurant data
        const { data, error } = await supabase
          .from('users')
          .select('restaurant_name, description')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error loading profile data:', error)
          return
        }

        // Set the data in state
        if (data) {
          setRestaurantName(data.restaurant_name || '')
          setDescription(data.description || '')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [user]) // Run when user changes (null -> user object)

  // Save profile data when user clicks save
  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      const supabase = createClient()
      
      // Update the profile data in the users table
      const { error } = await supabase
        .from('users')
        .update({ 
          restaurant_name: restaurantName,
          description: description
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error saving profile data:', error)
        return
      }

      console.log('Profile saved successfully!')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {saving ? (
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
        {/* Email Field (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
          />
          <p className="mt-1 text-sm text-gray-500">Your email address cannot be changed.</p>
        </div>

        {/* Restaurant Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter your restaurant name"
          />
          <p className="mt-1 text-sm text-gray-500">This will be displayed on your restaurant website.</p>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Tell customers about your restaurant, your story, specialties, etc."
          />
          <p className="mt-1 text-sm text-gray-500">A brief description of your restaurant that will appear on your website.</p>
        </div>
      </div>
    </div>
  )
}
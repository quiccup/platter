'use client'
import { useRouter } from 'next/navigation'
import { UserButton, useUser } from "@clerk/nextjs"
import { createClient } from '@supabase/supabase-js'
import { generateUniqueSubdomain } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Website {
  id: string
  subdomain: string
  created_at: string
  restaurant_id: string
}

export default function DashboardHome() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [websites, setWebsites] = useState<Website[]>([])

  useEffect(() => {
    async function loadWebsites() {
      if (!user) return
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // First get the user's restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!restaurant) return

      // Then get websites for that restaurant
      const { data: websiteData } = await supabase
        .from('websites')
        .select('*')
        .eq('restaurant_id', restaurant.id)

      setWebsites(websiteData || [])
    }
    loadWebsites()
  }, [user])

  const handleCreateWebsite = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!restaurant) throw new Error('No restaurant found')

      // Generate subdomain from restaurant name
      const subdomain = await generateUniqueSubdomain(restaurant.name)

      // Create website
      const { data: website, error } = await supabase
        .from('websites')
        .insert({
          restaurant_id: restaurant.id,
          subdomain: subdomain,
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to edit page
      router.push(`/dashboard/websites/${website.id}/edit`)
    } catch (error) {
      console.error('Error creating website:', error)
      // Add error handling UI here
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
         <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Quiccup</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="border-b-2 border-orange-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">{user?.emailAddresses[0].emailAddress}</span>
              <UserButton/>
              {/* Add user menu dropdown here */}
            </div>
          </div>
        </div>
      </nav>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome {user?.firstName}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button 
            onClick={handleCreateWebsite}
            disabled={isLoading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Your Website'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.length === 0 ? (
          <div className="col-span-full bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">
              No Websites
            </h3>
          </div>
        ) : (
          websites.map((website) => (
            <div key={website.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Preview Image - placeholder for now */}
              <div className="h-48 bg-gray-100"></div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {website.subdomain}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {website.subdomain}.quiccup.com
                </p>
                
                <div className="mt-4 flex gap-2">
                  <a
                    href={`/dashboard/websites/${website.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    WEBSITE
                  </a>
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    SETTINGS
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
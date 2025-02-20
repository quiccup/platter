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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-orange-600">Quiccup</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/dashboard" 
                  className="border-b-2 border-orange-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.emailAddresses[0].emailAddress}</span>
              <UserButton afterSignOutUrl="/"/>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Welcome back, {user?.firstName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your restaurant websites and settings
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button 
              onClick={handleCreateWebsite}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create New Website'
              )}
            </button>
          </div>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.length === 0 ? (
            <div className="col-span-full bg-white shadow-sm rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Websites Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first website to get started
              </p>
              <button
                onClick={handleCreateWebsite}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-orange-600 rounded-md text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
              >
                Create Website
              </button>
            </div>
          ) : (
            websites.map((website) => (
              <div key={website.id} className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Preview Image */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                  <span className="text-orange-300 text-xl font-medium">Preview</span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {website.subdomain}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {website.subdomain}.quiccup.com
                  </p>
                  
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/dashboard/websites/${website.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                    >
                      Edit Website
                    </Link>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
'use client'
import { useRouter } from 'next/navigation'
import { UserButton, useUser } from "@clerk/nextjs"
import { createClient } from '@supabase/supabase-js'
import { generateUniqueSubdomain } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

interface Website {
  id: string
  subdomain: string
  created_at: string
  restaurant_id: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [websites, setWebsites] = useState<Website[]>([])

  useEffect(() => {
    async function loadWebsites() {
      if (!user) return
      
      try {
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
      } catch (error) {
        console.error('Error loading websites:', error)
      }
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

      // First check if user has a restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      let restaurantId = restaurant?.id

      // If no restaurant exists, create one
      if (!restaurantId) {
        const userName = user.firstName || 'restaurant'
        const { data: newRestaurant, error: restaurantError } = await supabase
          .from('restaurants')
          .insert({
            user_id: user.id,
            name: `${userName}'s Restaurant`
          })
          .select()
          .single()
          
        if (restaurantError) throw restaurantError
        restaurantId = newRestaurant.id
      }

      // Generate subdomain from user name
      const userName = user.firstName || 'restaurant'
      const subdomain = await generateUniqueSubdomain(userName)

      // Create website
      const { data: website, error } = await supabase
        .from('websites')
        .insert({
          restaurant_id: restaurantId,
          subdomain: subdomain,
          template: 'default'
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to the new website's edit page
      router.push(`/dashboard/websites/${website.id}/edit`)
    } catch (error) {
      console.error('Error creating website:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const firstName = user?.firstName || 'there'
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header/Nav */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold">P</span>
            </div>
            <span className="text-xl font-medium text-gray-200">Platter</span>
          </div>
          
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8">
              <Link href="/dashboard" className="text-white border-b-2 border-orange-500 pb-2">Dashboard</Link>
              <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">Settings</Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{user?.emailAddresses[0]?.emailAddress}</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div 
          className="bg-gray-900 rounded-xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}</h1>
              <p className="text-gray-400">Manage your restaurant websites and settings</p>
            </div>
            <button 
              onClick={handleCreateWebsite}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:hover:bg-orange-500"
            >
              <Plus className="h-5 w-5" />
              <span>{isLoading ? 'Creating...' : 'Create New Website'}</span>
            </button>
          </div>
        </motion.div>
        
        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {websites.map((website, index) => (
            <motion.div 
              key={website.id}
              className="bg-gray-900 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              {/* Preview Area */}
              <div className="aspect-video bg-gray-800 flex items-center justify-center border-b border-gray-800">
                <span className="text-gray-400">Preview</span>
              </div>
              
              {/* Website Info */}
              <div className="p-6">
                <h3 className="font-medium text-xl mb-1">{website.subdomain}</h3>
                <p className="text-gray-400 text-sm mb-6">{website.subdomain}.platter.com</p>
                
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/websites/${website.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Website</span>
                  </Link>
                  <Link
                    href={`/dashboard/websites/${website.id}/settings`}
                    className="px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
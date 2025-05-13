'use client'
import { useRouter } from 'next/navigation'
import { UserButton, useUser } from "@clerk/nextjs"
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Settings, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { CreateWebsiteModal } from '@/components/create-website-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Website {
  id: string
  subdomain: string
  name: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [websites, setWebsites] = useState<Website[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadWebsites() {
      if (!user) return
      
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Get websites for the user
        const { data: websiteData } = await supabase
          .from('websites')
          .select('*')
          .eq('user_id', user.id)

        setWebsites(websiteData || [])
      } catch (error) {
        console.error('Error loading websites:', error)
      }
    }
    loadWebsites()
  }, [user])

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
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Website</span>
            </button>
          </div>
        </motion.div>
        
        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {websites.map((website, index) => (
            <motion.div 
              key={website.id}
              className="border border-white/10 rounded-xl p-6 bg-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              {/* Website Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-xl mb-1">{website.name || website.subdomain}</h3>
                  <p className="text-gray-400 text-sm">{website.subdomain}.platter.com</p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/websites/${website.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Website</span>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-gray-900 border border-gray-800">
                      <DropdownMenuItem asChild className="text-gray-200 focus:bg-gray-800 focus:text-white cursor-pointer">
                        <Link href={`/dashboard/websites/${website.id}/settings?tab=permissions`}>
                          PERMISSIONS
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-gray-200 focus:bg-gray-800 focus:text-white cursor-pointer">
                        <Link href={`/dashboard/websites/${website.id}/settings?tab=billing`}>
                          BILLING
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-gray-200 focus:bg-gray-800 focus:text-white cursor-pointer">
                        <Link href={`/dashboard/websites/${website.id}/settings`}>
                          SETTINGS
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 focus:bg-gray-800 focus:text-red-500 cursor-pointer">
                        REMOVE ME
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Create Website Modal */}
      <CreateWebsiteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
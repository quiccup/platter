'use client'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { FinalProduct } from '../dashboard/websites/[id]/edit/FinalProduct'
import { motion, AnimatePresence } from 'framer-motion'
import { PreviewThemeProvider } from '@/components/preview-theme-provider'

interface WebsiteData {
  content: {
    theme?: 'dark' | 'light'
    navbar?: any
    menu?: any
    about?: any
    chefs?: any
    gallery?: any
    leaderboard?: any
    contact?: any
  }
  section_order: string[]
}

export default function WebsitePage() {
  const params = useParams()
  const websiteId = params.id as string
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function loadWebsiteData() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase
          .from('websites')
          .select('content, section_order')
          .eq('id', websiteId)
          .single()

        if (error) throw error

        if (data) {
          setWebsiteData(data)
        }
      } catch (error) {
        console.error('Error loading website data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadWebsiteData()
  }, [websiteId])

  const theme = websiteData?.content?.theme || 'dark'
  
  return (
    <PreviewThemeProvider initialTheme={theme}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
          >
            <motion.img
              src="/loading.png"
              alt="Loading..."
              className="w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {websiteData && (
        <FinalProduct 
          data={websiteData.content} 
          sectionOrder={websiteData.section_order || [
            'about',
            'chefs',
            'menu',   
            'chefs',
            'gallery',
            'leaderboard',
            'contact'
          ]} 
        />
      )}
    </PreviewThemeProvider>
  )
} 
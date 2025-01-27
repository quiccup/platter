'use client'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { FinalProduct } from '../dashboard/websites/[id]/edit/FinalProduct'

export default function WebsitePage() {
  const params = useParams()
  const websiteId = params.id as string
  const [websiteData, setWebsiteData] = useState(null)
  
  useEffect(() => {
    async function loadWebsiteData() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data } = await supabase
        .from('websites')
        .select('content')
        .eq('id', websiteId)
        .single()

      if (data?.content) {
        setWebsiteData(data.content)
      }
    }
    
    loadWebsiteData()
  }, [websiteId])

  if (!websiteData) {
    return <div>Loading...</div>
  }

  return <FinalProduct data={websiteData} />
} 
"use client"

import { useState, useEffect } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '@/lib/services/menuService'
import { FullMenuTab } from './Tabs/FullMenuTab'
import { BudgetBasedTab } from './Tabs/BudgetBasedTab'
import { SectionWrapper } from '../../components/SectionWrapper'
import { createClient } from '@supabase/supabase-js'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuDisplayProps {
  data: {
    items: MenuItem[]
  }
  websiteId: string
}

export function MenuDisplay({ data, websiteId }: MenuDisplayProps) {
  const { theme } = usePreviewTheme()
  const [budgetCombos, setBudgetCombos] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(data?.items || [])
  
  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(data?.items || [])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = data?.items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
    setFilteredItems(filtered || [])
  }, [searchQuery, data?.items])

  useEffect(() => {
    async function fetchBudgetCombos() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data: websiteData, error } = await supabase
          .from('websites')
          .select('content')
          .eq('id', websiteId)
          .single()

        if (error) throw error

        if (websiteData?.content?.budget) {
          setBudgetCombos(websiteData.content.budget)
        }
      } catch (error) {
        console.error('Error fetching budget combos:', error)
      }
    }

    fetchBudgetCombos()
  }, [websiteId])
  
  if (!data?.items || data.items.length === 0) return null
  
  return (
    <>
      <SectionWrapper darkBackground>
        <div className="mb-12">
          <BudgetBasedTab 
            menuItems={data.items} 
            websiteId={websiteId} 
            budgetCombos={budgetCombos}
          />
        </div>
      </SectionWrapper>
      
      <SectionWrapper darkBackground fullWidth>
        <div className="container mx-auto px-4">
          <FullMenuTab items={filteredItems} />
        </div>
      </SectionWrapper>
    </>
  )
}
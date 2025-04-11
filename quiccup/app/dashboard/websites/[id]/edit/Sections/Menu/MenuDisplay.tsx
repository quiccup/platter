"use client"

import { useState, useEffect } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../types'
import { FullMenuTab } from './Tabs/FullMenuTab'
import { BudgetBasedTab } from './Tabs/BudgetBasedTab'
import { SectionWrapper } from '../../components/SectionWrapper'
import { createClient } from '@supabase/supabase-js'

interface MenuDisplayProps {
  data: {
    items: MenuItem[]
  }
  websiteId: string
}

export function MenuDisplay({ data, websiteId }: MenuDisplayProps) {
  const { theme } = usePreviewTheme()
  const [budgetCombos, setBudgetCombos] = useState<any>(null)
  
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
      {/* Budget Planner in rounded container */}
      <SectionWrapper>
        <div className="mb-12">
          <BudgetBasedTab 
            menuItems={data.items} 
            websiteId={websiteId} 
            budgetCombos={budgetCombos}
          />
        </div>
      </SectionWrapper>
      
      {/* Full Menu with dark background */}
      <SectionWrapper darkBackground fullWidth>
        <div className="container mx-auto px-4">
          {/* <h2 className="text-3xl font-bold mb-8 text-white">Our Menu</h2> */}
          <FullMenuTab items={data.items} />
        </div>
      </SectionWrapper>
    </>
  )
}
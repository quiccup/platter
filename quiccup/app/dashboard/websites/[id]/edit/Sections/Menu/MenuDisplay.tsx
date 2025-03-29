"use client"

import { useState } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../types'
import { FullMenuTab } from './Tabs/FullMenuTab'
import { BudgetBasedTab } from './Tabs/BudgetBasedTab'

interface MenuDisplayProps {
  data: {
    items: MenuItem[]
  }
  websiteId: string
}

export function MenuDisplay({ data, websiteId }: MenuDisplayProps) {
  const { theme } = usePreviewTheme()
  
  if (!data?.items || data.items.length === 0) return null
  
  return (
    <div className="w-full">
      {/* Budget Planner Section (Above Full Menu) */}
      <div className={`py-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <BudgetBasedTab menuItems={data.items} websiteId={websiteId} />
        </div>
      </div>
      
      {/* Full Menu Section (Below Budget Planner) */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Full Menu</h2>
          <FullMenuTab items={data.items} />
        </div>
      </div>
    </div>
  )
}
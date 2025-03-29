"use client"

import { useState } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../../types'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BudgetBasedTabProps {
  menuItems: MenuItem[]
  websiteId: string
}

export function BudgetBasedTab({ menuItems, websiteId }: BudgetBasedTabProps) {
  const { theme } = usePreviewTheme()
  const [budget, setBudget] = useState(30)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Minimalistic budget input section */}
      <div className="flex items-center gap-3">
        <motion.input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          placeholder="Enter budget here"
          className={`
            w-full px-6 h-14 text-lg rounded-full
            ${theme === 'dark' 
              ? 'bg-gray-800 text-white placeholder:text-gray-400' 
              : 'bg-white text-gray-900 placeholder:text-gray-400'
            }
            border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20
          `}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-14 w-14 rounded-full bg-black flex items-center justify-center flex-shrink-0"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Results section - keeping it minimal */}
      {isLoadingRecommendations ? (
        <div className="mt-8 text-center text-gray-500">Finding the perfect combination...</div>
      ) : (
        <div className="mt-8">
          {/* Your existing results display logic here, but styled minimally */}
        </div>
      )}
    </div>
  )
} 
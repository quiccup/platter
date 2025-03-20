"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../types'
import { FullMenuTab } from './Tabs/FullMenuTab'
import { BudgetBasedTab } from './Tabs/BudgetBasedTab'
import { PartyOrdersTab } from './Tabs/PartyOrdersTab'
import { Utensils, DollarSign, Users } from 'lucide-react'
import { Dock, DockIcon } from '@/components/ui/dock'

interface MenuDisplayProps {
  data: {
    items: MenuItem[]
  }
  websiteId: string
}

export function MenuDisplay({ data, websiteId }: MenuDisplayProps) {
  const { theme } = usePreviewTheme()
  const [activeTab, setActiveTab] = useState("budget-based")
  const menuItems = data?.items || []
  
  return (
    <div className={`py-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        
        <div className="max-w-4xl mx-auto">
          {/* Magic UI Dock for navigation */}
          <div className="flex justify-center mb-10">
            <Dock 
              direction="middle" 
              className="relative bg-white dark:bg-gray-800 py-4 px-6 rounded-full shadow-md w-auto flex justify-center items-center gap-12"
            >
              <DockIcon 
                className={`flex flex-col items-center ${
                  activeTab === 'full-menu' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                } hover:text-blue-500 dark:hover:text-blue-300 transition-colors`}
                onClick={() => setActiveTab('full-menu')}
              >
                <Utensils className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-medium">Full Menu</span>
              </DockIcon>
              
              <DockIcon
                className={`flex flex-col items-center ${
                  activeTab === 'budget-based' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                } hover:text-blue-500 dark:hover:text-blue-300 transition-colors relative`}
                onClick={() => setActiveTab('budget-based')}
              >
                <DollarSign className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-medium">Budget Based</span>
                {activeTab !== 'budget-based' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 2, repeatDelay: 3 }}
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500"
                  />
                )}
              </DockIcon>
              
              <DockIcon
                className={`flex flex-col items-center ${
                  activeTab === 'party-orders' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                } hover:text-blue-500 dark:hover:text-blue-300 transition-colors`}
                onClick={() => setActiveTab('party-orders')}
              >
                <Users className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-medium">Party Orders</span>
              </DockIcon>
            </Dock>
          </div>
          
          {/* Tab content with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            {activeTab === 'full-menu' && <FullMenuTab menuItems={menuItems} />}
            {activeTab === 'budget-based' && <BudgetBasedTab menuItems={menuItems} websiteId={websiteId} />}
            {activeTab === 'party-orders' && <PartyOrdersTab />}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Custom CSS to hide scrollbar but keep functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
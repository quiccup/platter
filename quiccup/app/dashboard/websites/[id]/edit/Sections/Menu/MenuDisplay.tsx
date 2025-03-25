"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../types'
import { FullMenuTab } from './Tabs/FullMenuTab'
import { BudgetBasedTab } from './Tabs/BudgetBasedTab'
import { PartyOrdersTab } from './Tabs/PartyOrdersTab'
import { Sparkles, Users, Menu as MenuIcon } from 'lucide-react'
import { Dock, DockIcon } from '@/components/ui/dock'

interface MenuDisplayProps {
  data: {
    items: MenuItem[]
  }
  websiteId: string
}

export function MenuDisplay({ data, websiteId }: MenuDisplayProps) {
  const { theme } = usePreviewTheme()
  const [activeTab, setActiveTab] = useState('full')
  
  if (!data?.items || data.items.length === 0) return null
  
  // Tab button component for consistent styling
  const TabButton = ({ id, label, icon, active }: { id: string, label: string, icon: React.ReactNode, active: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative flex-1 py-4 px-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
        active 
          ? theme === 'dark' 
            ? 'text-white' 
            : 'text-gray-900' 
          : theme === 'dark'
            ? 'text-gray-400 hover:text-gray-200' 
            : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      {/* Icon */}
      <div className={`transition-all duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      
      {/* Label */}
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      
      {/* Active indicator */}
      {active && (
        <motion.div 
          className={`absolute bottom-0 inset-x-0 h-1 rounded-t-full ${
            theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
          }`}
          layoutId="activeMenuTab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  )
  
  return (
    <div className={`w-full pb-12 pt-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Menu Tabs */}
        <div className="max-w-xl mx-auto mb-8">
          <div className={`flex rounded-full shadow-md ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <TabButton 
              id="full" 
              label="Full Menu" 
              icon={<MenuIcon className={`h-5 w-5 ${activeTab === 'full' ? 'text-blue-500' : ''}`} />} 
              active={activeTab === 'full'} 
            />
            
            <TabButton 
              id="budget" 
              label="Budget Based" 
              icon={<Sparkles className={`h-5 w-5 ${activeTab === 'budget' ? 'text-blue-500' : ''}`} />} 
              active={activeTab === 'budget'} 
            />
            
            <TabButton 
              id="party" 
              label="Party Orders" 
              icon={<Users className={`h-5 w-5 ${activeTab === 'party' ? 'text-blue-500' : ''}`} />} 
              active={activeTab === 'party'} 
            />
          </div>
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'full' && (
            <motion.div
              key="full-menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <FullMenuTab items={data.items} />
            </motion.div>
          )}
          
          {activeTab === 'budget' && (
            <motion.div
              key="budget-based"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BudgetBasedTab items={data.items} websiteId={websiteId} />
            </motion.div>
          )}
          
          {activeTab === 'party' && (
            <motion.div
              key="party-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PartyOrdersTab items={data.items} />
            </motion.div>
          )}
        </AnimatePresence>
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
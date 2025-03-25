"use client"

import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MenuItem } from '../../../types'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { Badge } from '@/components/ui/badge'

interface FullMenuTabProps {
  items: MenuItem[]
}

export function FullMenuTab({ items = [] }: FullMenuTabProps) {
  const { theme } = usePreviewTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  const scrollRef = useRef<HTMLDivElement | null>(null)
  
  // Safely compute all categories
  const allCategories = useMemo(() => {
    const categories = new Set(['All'])
    
    // Safely check if items exists and is an array before using forEach
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (item.tags && item.tags.length > 0) {
          item.tags.forEach(tag => categories.add(tag))
        }
      })
    }
    
    return Array.from(categories)
  }, [items])
  
  // Filter items based on active category
  const filteredItems = useMemo(() => {
    return activeCategory === 'All' 
      ? items 
      : items.filter(item => item.tags?.includes(activeCategory))
  }, [activeCategory, items])
  
  // Scroll functions for category scrolling
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }
  
  return (
    <motion.div
      key="full-menu"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Category filtering */}
      {allCategories.length > 1 && (
        <div className="relative mb-8">
          <button 
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } shadow-md z-10`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto hide-scrollbar py-2 px-8"
          >
            {allCategories.map(category => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  category === activeCategory
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-blue-500 text-white font-medium'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
          
          <button 
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } shadow-md z-10`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {item.image && (
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="font-bold text-lg">${item.price}</span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description || 'No description available'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 
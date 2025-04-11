"use client"

import { useState, useEffect } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../../types'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FullMenuTabProps {
  items: MenuItem[]
}

// Updated MenuItem type definition to include the missing properties and tags
interface EnhancedMenuItem extends MenuItem {
  title: string;
  tags?: string[];
  calories?: number;
  description?: string;
}

export function FullMenuTab({ items }: FullMenuTabProps) {
  const { theme } = usePreviewTheme()
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(items)
  
  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
    setFilteredItems(filtered)
  }, [searchQuery, items])

  // Extract categories from menu items' tags
  useEffect(() => {
    const tagSet = new Set<string>();
    
    // Extract all unique tags from items
    items.forEach(item => {
      const enhancedItem = item as EnhancedMenuItem;
      if (enhancedItem.tags && Array.isArray(enhancedItem.tags)) {
        enhancedItem.tags.forEach(tag => {
          if (tag && tag.trim() !== '') {
            tagSet.add(tag.trim());
          }
        });
      }
    });
    
    // If no tags are found, add some placeholder categories
    if (tagSet.size === 0) {
      tagSet.add('Breakfast');
      tagSet.add('Lunch');
      tagSet.add('Dinner');
    }
    
    setCategories(['All', ...Array.from(tagSet)]);
  }, [items]);
  
  // Filter items by active category tag
  const filteredItemsByCategory = activeCategory === 'All'
    ? items
    : items.filter(item => {
        const enhancedItem = item as EnhancedMenuItem;
        return enhancedItem.tags && 
               Array.isArray(enhancedItem.tags) && 
               enhancedItem.tags.includes(activeCategory);
      });
  
  return (
    <div className="w-full">
      {/* Updated Category Filter Pills container */}
      <div className="relative h-12 mb-8 overflow-hidden">
        <AnimatePresence>
          {!isSearching && (
            <motion.div 
              className="flex items-center gap-4 w-full"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsSearching(true)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              {/* Updated filters container */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-3 pb-2 w-max">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                        activeCategory === category
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-white text-black dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {isSearching && (
            <motion.div 
              className="absolute inset-0 flex items-center gap-2"
              initial={{ width: '48px', opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: '48px', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center w-full bg-white dark:bg-gray-800 rounded-full">
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full h-12 px-4 rounded-full bg-transparent text-black dark:text-white focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery('')
                }}
                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Menu items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => {
          // Type assertion to access the properties safely
          const enhancedItem = item as EnhancedMenuItem;
          
          return (
            <div 
              key={index} 
              className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              {/* Image container - Square aspect ratio */}
              <div className="aspect-square relative">
                {enhancedItem.image ? (
                  <img 
                    src={enhancedItem.image} 
                    alt={enhancedItem.title || 'Menu item'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {enhancedItem.title}
                  </h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">
                    {enhancedItem.price}
                  </span>
                </div>
                
                {/* Description - if available */}
                {enhancedItem.description && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {enhancedItem.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty state if no items */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No menu items found in this category</p>
        </div>
      )}
    </div>
  )
}

// Update the hide-scrollbar CSS
const styles = `
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
` 
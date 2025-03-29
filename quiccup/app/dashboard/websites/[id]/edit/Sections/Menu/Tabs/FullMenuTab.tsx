"use client"

import { useState, useEffect } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../../types'
import { Search } from 'lucide-react'

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
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => {
        const enhancedItem = item as EnhancedMenuItem;
        return enhancedItem.tags && 
               Array.isArray(enhancedItem.tags) && 
               enhancedItem.tags.includes(activeCategory);
      });
  
  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div 
        className="flex items-center gap-2 mb-8 overflow-x-auto pb-2" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none' 
        }}
      >
        {/* Search icon pill */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700">
          <Search size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        
        {/* Category pills - Using tags for filtering */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
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
'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createClient } from '@supabase/supabase-js'
import { MenuItem } from '../../types'
import { Check, ListOrdered } from 'lucide-react'

export interface LeaderboardData {
  title: string
  subtitle?: string
  featuredItems: string[] // IDs of the menu items
}

interface LeaderboardEditProps {
  data: any
  onChange: (data: LeaderboardData) => void
  websiteId: string
}

export function LeaderboardEdit({ data, onChange, websiteId }: LeaderboardEditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [subtitle, setSubtitle] = useState('Most popular dishes')

  // Initialize component state from props
  useEffect(() => {
    if (data?.featuredItems) {
      setSelectedItems(data.featuredItems)
    }
    
    if (data?.subtitle) {
      setSubtitle(data.subtitle)
    }
    
    // If data is empty or missing key properties, initialize it
    if (!data || !data.title) {
      onChange({
        title: 'Top 5',
        subtitle: 'Most popular dishes',
        featuredItems: []
      })
    }
  }, [data, onChange])

  // Fetch menu items
  useEffect(() => {
    async function fetchMenuItems() {
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
        
        if (websiteData?.content?.menu?.items) {
          setMenuItems(websiteData.content.menu.items)
        }
      } catch (error) {
        console.error('Error loading menu items:', error)
      }
    }
    
    fetchMenuItems()
  }, [websiteId])

  const handleSave = () => {
    // Create new data object with safe defaults
    const newData: LeaderboardData = {
      title: data?.title || 'Top 5',
      subtitle: subtitle || 'Most popular dishes',
      featuredItems: selectedItems.slice(0, 5) // Ensure we only have 5 items max
    }
    onChange(newData)
    setIsModalOpen(false)
  }

  const toggleItem = (itemTitle: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemTitle)) {
        return prev.filter(title => title !== itemTitle)
      } else {
        // Only allow 5 items max
        if (prev.length >= 5) {
          return [...prev.slice(1), itemTitle]
        }
        return [...prev, itemTitle]
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Simplified UI - Just the manage button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
          size="lg"
        >
          <ListOrdered className="w-4 h-4" />
          Manage Top 5
        </Button>
      </div>
      
      {/* Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Top 5 Dishes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
            {menuItems.length === 0 ? (
              <p className="text-sm text-gray-500">No menu items found. Please add items to your menu first.</p>
            ) : (
              menuItems.map((item) => {
                const isSelected = selectedItems.includes(item.title)
                return (
                  <div 
                    key={item.title}
                    onClick={() => toggleItem(item.title)}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    } cursor-pointer transition-colors`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-blue-500 text-white' : 'border border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          {item.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-gray-500 text-sm line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

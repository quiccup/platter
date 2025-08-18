'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, ListPlus } from "lucide-react"
import { MenuItemsModal } from './MenuItemsModal'
import { toast } from 'react-hot-toast'
import { menuService, MenuItem } from '@/lib/services/menuService'

interface MenuEditorProps {
  userId: string
}

export function MenuEditor({ userId }: MenuEditorProps) {
  const [menuItemsModalOpen, setMenuItemsModalOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load menu items from database
  useEffect(() => {
    loadMenuItems()
  }, [userId])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      const { data: items, error } = await menuService.getMenuItems(userId)
      if (error) {
        console.error('Error loading menu items:', error)
        toast.error('Failed to load menu items')
        return
      }
      setMenuItems(items || [])
    } catch (error) {
      console.error('Error loading menu items:', error)
      toast.error('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleMenuItemsChange = async (items: MenuItem[]) => {
    setMenuItems(items)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading menu items...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Menu Items</h3>
        <Button variant="outline" onClick={() => setMenuItemsModalOpen(true)}>
          <ListPlus className="h-4 w-4 mr-2" />
          Add Items
        </Button>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">${item.price}</p>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              {item.tags?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {menuItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No menu items yet. Add your first item above!</p>
          </div>
        )}
      </div>

      <MenuItemsModal 
        open={menuItemsModalOpen}
        onOpenChange={setMenuItemsModalOpen}
        items={menuItems}
        onItemsChange={handleMenuItemsChange}
        userId={userId}
      />
    </div>
  )
}

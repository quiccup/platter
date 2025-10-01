'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, ListPlus } from "lucide-react"
import { MenuItemsModal } from './MenuItemsModal'
import { MenuItemsTable } from './MenuItemsTable'
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

  const handleEditItem = (item: MenuItem) => {
    // TODO: Implement edit functionality
    console.log('Edit item:', item)
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await menuService.deleteMenuItem(itemId)
      if (error) {
        console.error('Error deleting menu item:', error)
        toast.error('Failed to delete menu item')
        return
      }
      toast.success('Menu item deleted successfully')
      loadMenuItems() // Reload the list
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const handleViewItem = (item: MenuItem) => {
    // TODO: Implement view functionality
    console.log('View item:', item)
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

      <MenuItemsTable
        items={menuItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onView={handleViewItem}
      />

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

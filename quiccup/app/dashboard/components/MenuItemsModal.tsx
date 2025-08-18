'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X } from 'lucide-react'

import { MenuItem, menuService } from '@/lib/services/menuService'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface MenuItemsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: MenuItem[]
  onItemsChange: (items: MenuItem[]) => void
  userId: string
}

export function MenuItemsModal({ open, onOpenChange, items, onItemsChange, userId }: MenuItemsModalProps) {
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    tags: ''
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const price = parseFloat(formData.price)
      if (!formData.name || isNaN(price) || price <= 0) {
        toast.error('Please provide a valid name and price')
        return
      }

      const item = {
        user_id: userId,
        name: formData.name,
        price,
        description: formData.description || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined
      }

      if (editingItem) {
        const { error } = await menuService.updateMenuItem(editingItem.id!, {
          name: formData.name,
          price,
          description: formData.description || undefined,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined
        })
        if (error) {
          toast.error('Failed to update menu item')
          return
        }
        toast.success('Menu item updated successfully')
      } else {
        const { error } = await menuService.createMenuItem(item)
        if (error) {
          toast.error('Failed to create menu item')
          return
        }
        toast.success('Menu item created successfully')
      }

      const { data: updatedItems } = await menuService.getMenuItems(userId)
      if (updatedItems) {
        onItemsChange(updatedItems)
      }
      resetForm()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Failed to save menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const { error } = await menuService.deleteMenuItem(id)
      if (error) {
        toast.error('Failed to delete menu item')
        return
      }
      toast.success('Menu item deleted successfully')
      const { data: updatedItems } = await menuService.getMenuItems(userId)
      if (updatedItems) {
        onItemsChange(updatedItems)
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      tags: item.tags?.join(', ') || ''
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      tags: ''
    })
    setEditingItem(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Menu Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add/Edit Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Item name"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="9.99"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Item description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="vegetarian, spicy, gluten-free"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingItem ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {!editingItem && <Plus className="h-4 w-4 mr-2" />}
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </>
                )}
              </Button>
              {editingItem && (
                <Button onClick={resetForm} variant="outline" disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Existing Items List */}
          <div className="space-y-3">
            <h3 className="font-medium">Current Menu Items ({items.length})</h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-green-600">${item.price}</span>
                    {item.tags?.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-blue-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id!)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No menu items yet. Add your first item above!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

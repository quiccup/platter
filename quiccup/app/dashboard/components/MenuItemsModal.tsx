'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X } from 'lucide-react'

interface MenuItem {
  title: string
  description: string
  price: string
  image?: string
  category?: string
  tags: string[]
}

interface MenuItemsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: MenuItem[]
  onItemsChange: (items: MenuItem[]) => void
}

export function MenuItemsModal({ open, onOpenChange, items, onItemsChange }: MenuItemsModalProps) {
  const [newItem, setNewItem] = useState<MenuItem>({
    title: '',
    description: '',
    price: '',
    category: 'Main',
    tags: []
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddItem = () => {
    if (newItem.title && newItem.price) {
      const updatedItems = [...items, { ...newItem, id: Date.now().toString() }]
      onItemsChange(updatedItems)
      setNewItem({
        title: '',
        description: '',
        price: '',
        category: 'Main',
        tags: []
      })
    }
  }

  const handleEditItem = (index: number) => {
    setEditingIndex(index)
    setNewItem(items[index])
  }

  const handleUpdateItem = () => {
    if (editingIndex !== null && newItem.title && newItem.price) {
      const updatedItems = [...items]
      updatedItems[editingIndex] = { ...newItem, id: items[editingIndex].id }
      onItemsChange(updatedItems)
      setEditingIndex(null)
      setNewItem({
        title: '',
        description: '',
        price: '',
        category: 'Main',
        tags: []
      })
    }
  }

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    onItemsChange(updatedItems)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setNewItem({
      title: '',
      description: '',
      price: '',
      category: 'Main',
      tags: []
    })
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
              {editingIndex !== null ? 'Edit Item' : 'Add New Item'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Item name"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="$12.99"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Main, Appetizer, etc."
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newItem.tags.join(', ')}
                  onChange={(e) => setNewItem({ 
                    ...newItem, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="spicy, vegetarian, popular"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editingIndex !== null ? (
                <>
                  <Button onClick={handleUpdateItem} className="flex-1">
                    Update Item
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddItem} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
            </div>
          </div>

          {/* Existing Items List */}
          <div className="space-y-3">
            <h3 className="font-medium">Current Menu Items ({items.length})</h3>
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-green-600">{item.price}</span>
                    {item.category && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    )}
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-blue-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditItem(index)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
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

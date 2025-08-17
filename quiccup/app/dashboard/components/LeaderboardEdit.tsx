'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trophy, X } from 'lucide-react'

interface LeaderboardItem {
  id: string
  name: string
  score: number
  rank: number
}

interface LeaderboardEditProps {
  data: { items: LeaderboardItem[] }
  onChange: (data: { items: LeaderboardItem[] }) => void
}

export function LeaderboardEdit({ data, onChange }: LeaderboardEditProps) {
  const [newItem, setNewItem] = useState({
    name: '',
    score: 0
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddItem = () => {
    if (newItem.name) {
      const item: LeaderboardItem = {
        id: Date.now().toString(),
        ...newItem,
        rank: (data?.items?.length || 0) + 1
      }
      const updatedItems = [...(data?.items || []), item]
      onChange({ items: updatedItems })
      setNewItem({ name: '', score: 0 })
      setShowAddForm(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    const updatedItems = (data?.items || []).filter(item => item.id !== id)
    onChange({ items: updatedItems })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top Dishes Editor</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dish
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Manage your restaurant's top dishes and their rankings
      </p>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add New Top Dish</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dish-name">Dish Name</Label>
              <Input
                id="dish-name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Dish name"
              />
            </div>
            <div>
              <Label htmlFor="dish-score">Score</Label>
              <Input
                id="dish-score"
                type="number"
                value={newItem.score}
                onChange={(e) => setNewItem({ ...newItem, score: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddItem}>Add Dish</Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing Items */}
      <div className="space-y-4">
        <h4 className="font-medium">Top Dishes ({data?.items?.length || 0})</h4>
        
        {(data?.items?.length || 0) === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No top dishes yet. Add your first dish above!
          </p>
        ) : (
          <div className="space-y-3">
            {(data?.items || []).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-500">Score: {item.score}</div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Gamepad2, X } from 'lucide-react'

interface Game {
  id: string
  name: string
  description: string
  image?: string
}

interface PlayEditProps {
  data: { games: Game[] }
  onChange: (data: { games: Game[] }) => void
}

export function PlayEdit({ data, onChange }: PlayEditProps) {
  const [newGame, setNewGame] = useState({
    name: '',
    description: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddGame = () => {
    if (newGame.name && newGame.description) {
      const game: Game = {
        id: Date.now().toString(),
        ...newGame
      }
      const updatedGames = [...(data?.games || []), game]
      onChange({ games: updatedGames })
      setNewGame({ name: '', description: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteGame = (id: string) => {
    const updatedGames = (data?.games || []).filter(game => game.id !== id)
    onChange({ games: updatedGames })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Games & Interactive Content Editor</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Game
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Manage interactive games and content for your customers
      </p>

      {/* Add Game Form */}
      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add New Game</h4>
          
          <div>
            <Label htmlFor="game-name">Game Name</Label>
            <Input
              id="game-name"
              value={newGame.name}
              onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
              placeholder="Game name"
            />
          </div>

          <div>
            <Label htmlFor="game-description">Game Description</Label>
            <Textarea
              id="game-description"
              value={newGame.description}
              onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
              placeholder="Describe the game and how to play..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddGame}>Add Game</Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing Games */}
      <div className="space-y-4">
        <h4 className="font-medium">Games ({(data?.games?.length || 0)})</h4>
        
        {(data?.games?.length || 0) === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No games yet. Add your first game above!
          </p>
        ) : (
          <div className="space-y-3">
            {(data?.games || []).map((game) => (
              <div key={game.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{game.name}</span>
                    </div>
                    <p className="text-gray-700">{game.description}</p>
                  </div>
                  <Button
                    onClick={() => handleDeleteGame(game.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

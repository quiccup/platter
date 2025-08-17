'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Star, X } from 'lucide-react'

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

interface ReviewsEditProps {
  data: Review[]
  onChange: (data: Review[]) => void
}

export function ReviewsEdit({ data, onChange }: ReviewsEditProps) {
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddReview = () => {
    if (newReview.author && newReview.comment) {
      const review: Review = {
        id: Date.now().toString(),
        ...newReview,
        date: new Date().toLocaleDateString()
      }
      onChange([...data, review])
      setNewReview({ author: '', rating: 5, comment: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteReview = (id: string) => {
    onChange(data.filter(review => review.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews Editor</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Manage customer reviews and testimonials
      </p>

      {/* Add Review Form */}
      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add New Review</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Customer Name</Label>
              <Input
                id="author"
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${
                      star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Review Comment</Label>
            <Textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="What did the customer say about your restaurant?"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddReview}>Add Review</Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing Reviews */}
      <div className="space-y-4">
        <h4 className="font-medium">Current Reviews ({data.length})</h4>
        
        {data.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No reviews yet. Add your first review above!
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.author}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  <Button
                    onClick={() => handleDeleteReview(review.id)}
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

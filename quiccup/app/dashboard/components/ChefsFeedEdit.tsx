'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChefHat, X } from 'lucide-react'

interface ChefPost {
  id: string
  title: string
  content: string
  image?: string
  author: string
  date: string
}

interface ChefsFeedEditProps {
  data: { posts: ChefPost[] }
  onChange: (data: { posts: ChefPost[] }) => void
}

export function ChefsFeedEdit({ data, onChange }: ChefsFeedEditProps) {
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPost = () => {
    if (newPost.title && newPost.content && newPost.author) {
      const post: ChefPost = {
        id: Date.now().toString(),
        ...newPost,
        date: new Date().toLocaleDateString()
      }
      const updatedPosts = [...(data?.posts || []), post]
      onChange({ posts: updatedPosts })
      setNewPost({ title: '', content: '', author: '' })
      setShowAddForm(false)
    }
  }

  const handleDeletePost = (id: string) => {
    const updatedPosts = (data?.posts || []).filter(post => post.id !== id)
    onChange({ posts: updatedPosts })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chefs Feed Editor</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Manage posts from your chefs and kitchen staff
      </p>

      {/* Add Post Form */}
      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add New Chef Post</h4>
          
          <div>
            <Label htmlFor="post-title">Post Title</Label>
            <Input
              id="post-title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Post title"
            />
          </div>

          <div>
            <Label htmlFor="post-author">Chef Name</Label>
            <Input
              id="post-author"
              value={newPost.author}
              onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
              placeholder="Chef name"
            />
          </div>

          <div>
            <Label htmlFor="post-content">Post Content</Label>
            <Textarea
              id="post-content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Share kitchen insights, recipes, or behind-the-scenes stories..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddPost}>Add Post</Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing Posts */}
      <div className="space-y-4">
        <h4 className="font-medium">Chef Posts ({(data?.posts?.length || 0)})</h4>
        
        {(data?.posts?.length || 0) === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No chef posts yet. Add your first post above!
          </p>
        ) : (
          <div className="space-y-3">
            {(data?.posts || []).map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">{post.title}</span>
                      <span className="text-sm text-gray-500">by {post.author}</span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                  <Button
                    onClick={() => handleDeletePost(post.id)}
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

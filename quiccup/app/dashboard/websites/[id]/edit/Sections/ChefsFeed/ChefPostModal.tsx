"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Plus, Upload, X, Loader2, Trash2 } from "lucide-react"
import { uploadImage } from "@/lib/uploadImage"

interface ChefPost {
  id: string
  name: string
  content: string
  images: string[]
  tags: string[]
  timestamp: string
}

interface ChefPostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  posts: ChefPost[]
  onSave: (post: ChefPost) => void
  onDelete: (postId: string) => void
}

export function ChefPostModal({ open, onOpenChange, posts, onSave, onDelete }: ChefPostModalProps) {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const imageUrl = await uploadImage(file)
      setImages([imageUrl])
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = () => {
    if (content.trim()) {
      onSave({
        id: Date.now().toString(),
        name: "Chef John",
        content,
        images,
        tags,
        timestamp: "Just now"
      })
      setContent("")
      setImages([])
      setTags([])
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="pb-4">
          <DialogTitle>Manage Posts</DialogTitle>
        </DialogHeader>

        {isCreating ? (
          <div className="space-y-4 overflow-y-auto pr-2">
            <Textarea
              placeholder="What's cooking in the kitchen?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none"
            />

            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                >
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                  />
                </span>
              ))}
              <Input
                placeholder="Add tag (press Enter)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-32 h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    e.preventDefault()
                    setTags([...tags, newTag.trim()])
                    setNewTag("")
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              {images[0] && (
                <div className="relative w-full h-40">
                  <img 
                    src={images[0]} 
                    alt="" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImages([])}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file)
                    }
                  }}
                  disabled={isUploading || images.length > 0}
                />
                <Button 
                  variant="outline" 
                  className="w-full h-8 text-xs"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading || images.length > 0}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1.5" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 mr-1.5" />
                      {images.length > 0 ? 'Change Image' : 'Add Image'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isUploading}
                className="h-8 text-xs"
              >
                Post
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              onClick={() => setIsCreating(true)}
              className="w-full h-9 text-sm"
            >
              Create New Post
            </Button>

            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-start justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3 max-w-[calc(100%-2rem)]">
                    <p className="text-xs font-medium break-words whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {post.images?.[0] && (
                        <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={post.images[0]} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[10px] bg-white px-1.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-600 flex-shrink-0 h-6 w-6 p-0"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
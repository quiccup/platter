"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Upload, Loader2, Trash2 } from "lucide-react"
import { uploadImage } from "@/lib/uploadImage"

interface GalleryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: string[]
  captions: { [key: string]: string }
  onImageAdd: (url: string) => void
  onImageDelete: (index: number) => void
  onCaptionChange: (imageUrl: string, caption: string) => void
}

export function GalleryModal({ 
  open, 
  onOpenChange, 
  images, 
  captions,
  onImageAdd, 
  onImageDelete,
  onCaptionChange
}: GalleryModalProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const url = await uploadImage(file, 'gallery')
      onImageAdd(url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader className="pb-4">
          <DialogTitle>Manage Gallery</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="gallery-image-upload"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file)
                }
              }}
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => document.getElementById('gallery-image-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Image
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {images.map((image, index) => (
              <div key={index} className="space-y-2">
                <div className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/40 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onImageDelete(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={captions[image] || ''}
                  onChange={(e) => onCaptionChange(image, e.target.value)}
                  placeholder="Add caption"
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
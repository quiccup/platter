'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X, Image as ImageIcon } from 'lucide-react'
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const imageUrl = await uploadImage(file, 'gallery')
      onImageAdd(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Gallery</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drag and drop images here, or click to browse
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload">
                <Button 
                  variant="outline" 
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
              </Label>
            </div>
          </div>

          {/* Images Grid */}
          <div className="space-y-4">
            <h3 className="font-medium">Gallery Images ({images.length})</h3>
            
            {images.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No images in your gallery yet. Upload some images above!
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="relative">
                      <img 
                        src={imageUrl} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        onClick={() => onImageDelete(index)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <Input
                        placeholder="Add caption..."
                        value={captions[imageUrl] || ''}
                        onChange={(e) => onCaptionChange(imageUrl, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

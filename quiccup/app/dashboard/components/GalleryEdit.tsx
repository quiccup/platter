'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { GalleryModal } from './GalleryModal'

interface GalleryData {
  images: string[]
  captions: { [key: string]: string }
}

interface GalleryEditProps {
  data: GalleryData
  onChange: (data: GalleryData) => void
}

export function GalleryEdit({ data, onChange }: GalleryEditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleImageAdd = (url: string) => {
    onChange({
      ...data,
      images: [...(data?.images || []), url]
    })
  }

  const handleImageDelete = (index: number) => {
    const newImages = data?.images?.filter((_, i) => i !== index) || []
    const newCaptions = { ...data?.captions }
    delete newCaptions[data?.images?.[index]]
    
    onChange({
      ...data,
      images: newImages,
      captions: newCaptions
    })
  }

  const handleCaptionChange = (imageUrl: string, caption: string) => {
    onChange({
      ...data,
      captions: {
        ...(data?.captions || {}),
        [imageUrl]: caption
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery Editor</h3>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          variant="default"
        >
          Manage Gallery
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">
        Add and manage your gallery images
      </p>

      <GalleryModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        images={data?.images || []}
        captions={data?.captions || {}}
        onImageAdd={handleImageAdd}
        onImageDelete={handleImageDelete}
        onCaptionChange={handleCaptionChange}
      />
    </div>
  )
}

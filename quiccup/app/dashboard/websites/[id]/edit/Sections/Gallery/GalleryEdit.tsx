'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { GalleryModal } from './GalleryModal'

interface GalleryData {
  images: string[]
}

export function GalleryEdit({ data, onChange }: { data: GalleryData, onChange: (data: GalleryData) => void }) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleAddImage = (url: string) => {
    const newImages = [...(data.images || []), url]
    onChange({ ...data, images: newImages })
  }

  const handleDeleteImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index)
    onChange({ ...data, images: newImages })
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => setModalOpen(true)} 
        variant="default"
        className="w-full"
      >
        Manage Gallery
      </Button>
      <p className="text-sm text-gray-500 text-center">
        Add and manage your gallery images
      </p>

      <GalleryModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        images={data.images || []}
        onImageAdd={handleAddImage}
        onImageDelete={handleDeleteImage}
      />
    </div>
  )
}

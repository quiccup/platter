'use client'
import { useState } from 'react'
import { uploadImage } from '@/lib/uploadImage'

interface GalleryData {
  images: string[]
}

export function GalleryEdit({ data, onChange }: { data: GalleryData, onChange: (data: GalleryData) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const url = await uploadImage(file, 'gallery')
      const newImages = [...(data.images || []), url]
      onChange({ ...data, images: newImages })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index)
    onChange({ ...data, images: newImages })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Gallery Images</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file)
          }}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-50 file:text-orange-700
            hover:file:bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.images?.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

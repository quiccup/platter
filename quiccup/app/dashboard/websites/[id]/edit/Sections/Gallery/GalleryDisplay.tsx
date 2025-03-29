'use client'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface GallerySectionProps {
  data: {
    images: string[]
    captions?: Record<string, string>
  }
}

export function GallerySection({ data }: GallerySectionProps) {
  const { theme } = usePreviewTheme()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  
  if (!data?.images || data.images.length === 0) return null
  
  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image)
    setSelectedIndex(index)
  }
  
  const closeLightbox = () => {
    setSelectedImage(null)
  }
  
  const goToPrevious = () => {
    const newIndex = selectedIndex === 0 ? data.images.length - 1 : selectedIndex - 1
    setSelectedIndex(newIndex)
    setSelectedImage(data.images[newIndex])
  }
  
  const goToNext = () => {
    const newIndex = selectedIndex === data.images.length - 1 ? 0 : selectedIndex + 1
    setSelectedIndex(newIndex)
    setSelectedImage(data.images[newIndex])
  }
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {data.images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow"
            onClick={() => openLightbox(image, index)}
          >
            <img
              src={image}
              alt={data.captions?.[image] || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => closeLightbox()}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  closeLightbox()
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="flex justify-between absolute inset-y-0 w-full items-center px-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="p-2 bg-black/50 text-white rounded-full"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="p-2 bg-black/50 text-white rounded-full"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              <div className="flex items-center justify-center h-[80vh]">
                <img 
                  src={selectedImage} 
                  alt={data.captions?.[selectedImage] || 'Gallery image'}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              {data.captions?.[selectedImage] && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <div className="bg-black/70 text-white p-2 mx-auto max-w-lg rounded">
                    {data.captions[selectedImage]}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

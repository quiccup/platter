'use client'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Marquee from '@/components/ui/marquee'

interface GallerySectionProps {
  data: {
    images: string[]
    captions?: Record<string, string>
  }
  companyName?: string
  address?: string
}

export function GallerySection({ data, companyName = "Restaurant Name", address }: GallerySectionProps) {
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

  const ImageCard = ({ image, index }: { image: string; index: number }) => (
    <div 
      className="relative w-64 h-64 mx-3 cursor-pointer overflow-hidden transition-all"
      onClick={() => openLightbox(image, index)}
    >
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-4 border-white/10">
        <img
          src={image}
          alt={data.captions?.[image] || `Gallery image ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  )

  // Split images into two groups for alternating directions
  const firstHalf = data.images.slice(0, Math.ceil(data.images.length / 2))
  const secondHalf = data.images.slice(Math.ceil(data.images.length / 2))

  return (
    <>
      <div className="relative space-y-6 py-12">
        {/* First row - left to right */}
        <Marquee className="py-2" pauseOnHover repeat={2}>
          {firstHalf.map((image, index) => (
            <ImageCard key={index} image={image} index={index} />
          ))}
        </Marquee>

        {/* Center Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-[#FBE8A4] text-black px-8 py-6 rounded-full min-w-[300px] text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{companyName}</h2>
            {address && (
              <p className="text-sm opacity-75">{address}</p>
            )}
          </div>
        </div>

        {/* Second row - right to left */}
        <Marquee className="py-2" reverse pauseOnHover repeat={2}>
          {secondHalf.map((image, index) => (
            <ImageCard 
              key={index + firstHalf.length} 
              image={image} 
              index={index + firstHalf.length} 
            />
          ))}
        </Marquee>
      </div>
      
      {/* Lightbox Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  closeLightbox()
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex justify-between absolute inset-y-0 w-full items-center px-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
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
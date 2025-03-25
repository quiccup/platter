'use client'
import BlurFade from "@/components/ui/blur-fade"
import { useMemo } from "react"
import { usePreviewTheme } from '@/components/preview-theme-provider'

interface GalleryData {
  images: string[]
  captions: { [key: string]: string }
}

interface GalleryDisplayProps {
  data: {
    images?: string[]
    captions?: { [key: string]: string }
  }
}

export function GallerySection({ data }: GalleryDisplayProps) {
  const { theme } = usePreviewTheme()
  const { images = [], captions = {} } = data
  
  const getRandomRotation = () => {
    // Even smaller rotation on mobile
    return window.innerWidth < 768 
      ? Math.random() * 6 - 3   // -3 to 3 degrees on mobile
      : Math.random() * 20 - 10 // -10 to 10 degrees on desktop
  }

  const getRandomOffset = () => {
    // Minimal offsets on mobile
    return window.innerWidth < 768
      ? Math.random() * 4 - 2   // -2 to 2 pixels on mobile
      : Math.random() * 20 - 10 // -10 to 10 pixels on desktop
  }

  const polaroids = useMemo(() => {
    return images?.map((url) => ({
      url,
      rotation: getRandomRotation(),
      offsetX: getRandomOffset(),
      offsetY: getRandomOffset(),
      caption: captions?.[url] || ''
    }))
  }, [images, captions])

  if (images.length === 0) return null
  
  return (
    <div className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Gallery
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="transform transition-transform hover:-rotate-2 hover:scale-105"
            >
              <div className="bg-white p-3 shadow-lg rounded-sm">
                <div className="aspect-square overflow-hidden mb-2">
                  <img 
                    src={image} 
                    alt={captions[image] || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {captions[image] && (
                  <div className="text-center text-gray-700 p-2">
                    {captions[image]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

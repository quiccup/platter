'use client'
import BlurFade from "@/components/ui/blur-fade"
import { useMemo } from "react"

interface GalleryData {
  images: string[]
}

export function GallerySection({ data }: { data: GalleryData }) {
  const getRandomRotation = () => {
    // Smaller rotation on mobile for better visibility
    return window.innerWidth < 768 
      ? Math.random() * 10 - 5  // -5 to 5 degrees on mobile
      : Math.random() * 20 - 10 // -10 to 10 degrees on desktop
  }

  const getRandomOffset = () => {
    // Smaller offsets on mobile
    return window.innerWidth < 768
      ? Math.random() * 10 - 5  // -5 to 5 pixels on mobile
      : Math.random() * 20 - 10 // -10 to 10 pixels on desktop
  }

  const polaroids = useMemo(() => {
    return data.images?.map((url) => ({
      url,
      rotation: getRandomRotation(),
      offsetX: getRandomOffset(),
      offsetY: getRandomOffset(),
    }))
  }, [data.images])

  if (!data?.images?.length) {
    return (
      <section id="photos" className="py-12">
        <div className="text-center text-gray-500">
          Add photos to your gallery
        </div>
      </section>
    )
  }

  return (
    <section id="photos" className="py-16 md:py-24 bg-zinc-900">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
          Our Gallery
        </h2>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 p-2 sm:p-4 md:p-6">
          {polaroids?.map((polaroid, idx) => (
            <BlurFade key={polaroid.url} delay={0.25 + idx * 0.05} inView>
              <div 
                className="group relative transition-transform duration-300 hover:scale-105 hover:z-10 mx-auto max-w-[300px]"
                style={{
                  transform: `rotate(${polaroid.rotation}deg) translate(${polaroid.offsetX}px, ${polaroid.offsetY}px)`,
                }}
              >
                {/* Polaroid frame */}
                <div className="relative bg-white p-2 sm:p-3 pb-10 sm:pb-12 rounded shadow-2xl">
                  {/* Image container */}
                  <div className="aspect-square overflow-hidden mb-2 sm:mb-4">
                    <img
                      src={polaroid.url}
                      alt={`Gallery image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Polaroid bottom text area */}
                  <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center">
                    <p className="text-gray-500 text-xs sm:text-sm font-handwriting">
                      {`Your Text Here`}
                    </p>
                  </div>
                </div>
                {/* Drop shadow effect */}
                <div 
                  className="absolute inset-0 -z-10 blur-sm bg-black/20 
                    transform translate-y-1 translate-x-1 rounded opacity-75"
                />
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

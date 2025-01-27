'use client'
import BlurFade from "@/components/ui/blur-fade"

interface GalleryData {
  images: string[]
}

export function GallerySection({ data }: { data: GalleryData }) {
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
    <section id="photos" className="py-12">
      <div className="container mx-auto px-4">
        <div className="columns-2 gap-4 sm:columns-3">
          {data.images.map((imageUrl, idx) => (
            <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
              <img
                className="mb-4 w-full rounded-lg object-cover"
                src={imageUrl}
                alt={`Gallery image ${idx + 1}`}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

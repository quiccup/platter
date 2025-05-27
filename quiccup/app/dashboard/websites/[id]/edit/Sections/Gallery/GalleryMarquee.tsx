import { cn } from '@/lib/utils';

export function GalleryMarquee({ images, captions }: { images: string[]; captions?: Record<string, string> }) {
  if (!images || images.length === 0) return null;

  const ImageCard = ({ image, caption }: { image: string; caption?: string }) => (
    <figure
      className={cn(
        'relative w-full h-full min-h-[220px] flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-xl border',
        'border-gray-950/[.1] bg-transparent hover:bg-gray-950/[.03]',
        'dark:border-gray-50/[.1] dark:bg-transparent dark:hover:bg-gray-50/[.05]'
      )}
    >
      <img
        className="w-full h-full object-cover rounded-xl"
        alt={caption || 'Gallery image'}
        src={image}
        style={{ aspectRatio: '1/1' }}
      />
    </figure>
  );

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-transparent">
      {images.map((img, i) => (
        <ImageCard key={img + i} image={img} caption={captions?.[img]} />
        
      ))}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
} 
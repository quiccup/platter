"use client"

interface MenuFilterBarProps {
  items: { tags: string[] }[]
  selectedTag: string
  onTagSelect: (tag: string) => void
}

export function MenuFilterBar({ items, selectedTag, onTagSelect }: MenuFilterBarProps) {
  // Get unique tags from all items
  const tags = ['All', ...new Set(items?.flatMap(item => item.tags || []))]

  return (
    <div className="w-screen relative mb-8">
      <div className="max-w-[100vw] overflow-hidden">
        {/* Fade edges on overflow - hidden on mobile */}
        <div className="relative px-4 md:px-8 lg:px-12">
          <div className="hidden md:block absolute left-4 md:left-8 lg:left-12 top-0 bottom-0 w-8 
            bg-gradient-to-r from-white to-transparent z-10" />
          <div className="hidden md:block absolute right-4 md:right-8 lg:right-12 top-0 bottom-0 w-8 
            bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrollable tags */}
          <div className="flex overflow-x-auto gap-2 pb-4 snap-x snap-mandatory
            scrollbar-hide md:scrollbar-default md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100
            max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-6rem)] mx-auto"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagSelect(tag)}
                className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors snap-start
                  ${selectedTag === tag
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
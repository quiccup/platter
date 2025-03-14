"use client"

import { useState } from 'react'
import { MenuFilterBar } from './MenuFilterBar'
import { MenuItem } from './types'

interface MenuItem {
  title: string
  description: string
  price: string
  image?: string
  category?: string
  tags?: string[]
}

interface MenuDisplayProps {
  data: {
    items: MenuItem[]
  }
}

export function MenuDisplay({ data }: MenuDisplayProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All')

  const filteredItems = selectedTag === 'All'
    ? data.items
    : data.items?.filter(item => item.tags?.includes(selectedTag))

  return (
    <section className="w-full pt-16 md:pt-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Our Menu
        </h2>

        {/* Filter Bar */}
        <div className="mb-12">
          <div className="flex overflow-x-auto gap-3 pb-4 justify-center
            scrollbar-hide md:scrollbar-default md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100"
          >
            {['All', ...new Set(data.items?.flatMap(item => item.tags || []))].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`flex-none px-6 py-2.5 rounded-full text-sm font-medium transition-colors
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

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
          gap-6 md:gap-8 auto-rows-auto content-start">
          {filteredItems?.map((item) => (
            <div 
              key={item.title + item.price}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 
                transform hover:-translate-y-1"
            >
              {item.image && (
                <div className="aspect-square w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base md:text-lg font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <span className="text-base md:text-lg font-bold text-green-600">
                    ${item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((tag, i) => (
                      <span 
                        key={tag + '-' + i}
                        className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

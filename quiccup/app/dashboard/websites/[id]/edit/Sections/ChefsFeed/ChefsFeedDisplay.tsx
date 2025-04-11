"use client";

import { useState } from 'react'
import { ChefPost } from '../../types'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChefsFeedDisplayProps {
  posts?: ChefPost[]
  logo?: string
  companyName?: string
}

export function ChefsFeedDisplay({ posts = [], logo, companyName }: ChefsFeedDisplayProps) {
  const { theme } = usePreviewTheme()
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  
  if (!posts || posts.length === 0) return null
  
  const activeStory = activeStoryIndex !== null ? posts[activeStoryIndex] : null
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeStoryIndex !== null && activeStoryIndex < posts.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1)
    }
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext(e as any)
    if (e.key === 'ArrowLeft') handlePrevious(e as any)
    if (e.key === 'Escape') setActiveStoryIndex(null)
  }
  
  // Get avatar for a chef (only as fallback if no images)
  const getChefAvatar = (name: string) => {
    const firstLetter = name?.charAt(0).toUpperCase() || 'C'
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xl font-bold w-full h-full">
        {firstLetter}
      </div>
    )
  }
  
  return (
    <div className="py-16 bg-[#111827] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Scroll buttons remain same */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white hidden md:block"
            onClick={() => {
              const container = document.getElementById('stories-container')
              if (container) container.scrollLeft -= 300
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white hidden md:block"
            onClick={() => {
              const container = document.getElementById('stories-container')
              if (container) container.scrollLeft += 300
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div 
            id="stories-container"
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                className="flex-none w-[300px] snap-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div 
                  onClick={() => setActiveStoryIndex(index)}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                >
                  {/* Gradient overlay - lighter now since we have less text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 z-10" />
                  
                  {/* Image */}
                  <div className="absolute inset-0 bg-gray-900">
                    {post.images && post.images.length > 0 ? (
                      <img 
                        src={post.images[0]} 
                        alt="Story"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                  </div>
                  
                  {/* Author Name Overlay with Logo */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                    <div className="flex items-center gap-2">
                      {logo ? (
                        <img 
                          src={logo} 
                          alt={companyName}
                          className="w-6 h-6 rounded-full object-cover border border-white"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                          {companyName?.charAt(0)}
                        </div>
                      )}
                      <h3 className="text-white font-semibold text-lg">
                        {post.author}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Full-screen Story View - Now with more prominent content */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
            onClick={() => setActiveStoryIndex(null)}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveStoryIndex(null);
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full">
              {activeStory.images && activeStory.images.length > 0 && (
                <img 
                  src={activeStory.images[0]} 
                  alt="Story"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}

              {/* Content Overlay at Bottom - Now more prominent */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="container mx-auto max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    {logo ? (
                      <img 
                        src={logo} 
                        alt={companyName}
                        className="w-8 h-8 rounded-full object-cover border border-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-white bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                        {companyName?.charAt(0)}
                      </div>
                    )}
                    <h3 className="text-white font-bold text-2xl">
                      {activeStory.author}
                    </h3>
                  </div>
                  <p className="text-white text-lg leading-relaxed">
                    {activeStory.content}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Add this to your global CSS file
`
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`

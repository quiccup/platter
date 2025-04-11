"use client";

import { useState } from 'react'
import { ChefPost } from '../../types'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChefsFeedDisplayProps {
  posts?: ChefPost[]
}

export function ChefsFeedDisplay({ posts = [] }: ChefsFeedDisplayProps) {
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
    <div className="py-16">
      <div className="container mx-auto px-4">
        
        {/* Stories Grid - Larger, more interactive cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <motion.button
              key={post.id}
              onClick={() => setActiveStoryIndex(index)}
              className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 z-10" />
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
              
              {/* Image */}
              <div className="absolute inset-0 bg-gray-900">
                {post.images && post.images.length > 0 ? (
                  <img 
                    src={post.images[0]} 
                    alt="Food"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  getChefAvatar(post.name || 'Chef')
                )}
              </div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {post.name}
                </h3>
                <p className="text-gray-200 text-sm line-clamp-2">
                  {post.content}
                </p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Updated Full-screen Story View */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Navigation Buttons */}
            {activeStoryIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {activeStoryIndex < posts.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Close Button */}
            <button 
              onClick={() => setActiveStoryIndex(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full">
              {activeStory.images && activeStory.images.length > 0 && (
                <img 
                  src={activeStory.images[0]} 
                  alt={activeStory.content || 'Story image'}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}

              {/* Content Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="container mx-auto max-w-4xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-4">
                      {/* Chef Avatar */}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {activeStory.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {activeStory.timestamp}
                      </p>
                    </div>
                  </div>

                  <p className="text-white text-lg mb-4">
                    {activeStory.content}
                  </p>

                  {activeStory.tags && activeStory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeStory.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-sm px-3 py-1 rounded-full bg-white/20 text-white"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client";

import { useState } from 'react'
import { ChefPost } from '../../types'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChefsFeedDisplayProps {
  posts?: ChefPost[]
  logo?: string
  companyName?: string
}

export function ChefsFeedDisplay({ posts = [] , logo, companyName }: ChefsFeedDisplayProps) {
  console.log({posts})
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  
  if (!posts || posts.length === 0) return null
  
  const activeStory = activeStoryIndex !== null ? posts[activeStoryIndex] : null

  return (
    <div className="py-16 overflow-hidden">
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
            className="flex overflow-x-auto gap-6 pb-4 px-2 scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {posts.map((post, index) => (
              <div key={post.id} className="flex flex-col items-center w-20">
                <button
                  onClick={() => setActiveStoryIndex(index)}
                  className="focus:outline-none"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <div
                    className="p-1 rounded-full"
                    style={{
                      background: 'conic-gradient(from 210deg at 50% 50%, #f58529, #dd2a7b, #8134af, #515bd4, #f58529)',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="bg-white rounded-full p-1" style={{ width: 56, height: 56 }}>
                      {post.images && post.images.length > 0 ? (
                        <img
                          src={post.images[0]}
                          alt={post.author}
                          className="rounded-full object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-200 rounded-full">
                          🍽️
                        </div>
                      )}
                    </div>
                  </div>
                </button>
                <div className="mt-2 w-16 text-xs text-center truncate">{post.author}</div>
              </div>
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

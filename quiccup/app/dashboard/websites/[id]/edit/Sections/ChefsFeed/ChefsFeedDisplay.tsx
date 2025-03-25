"use client";

import { useState } from 'react'
import { ChefPost } from '../../types'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { X } from 'lucide-react'

interface ChefsFeedDisplayProps {
  posts?: ChefPost[]
}

export function ChefsFeedDisplay({ posts = [] }: ChefsFeedDisplayProps) {
  const { theme } = usePreviewTheme()
  const [activeStory, setActiveStory] = useState<ChefPost | null>(null)
  
  // Don't render if there are no posts
  if (!posts || posts.length === 0) return null
  
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
    <div className={`w-full py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Chef Stories
        </h2>
        
        {/* Stories Thumbnails - Showing Food Images */}
        <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar">
          {posts.map((post) => (
            <div key={post.id} className="flex-none">
              <button
                onClick={() => setActiveStory(post)}
                className="flex flex-col items-center"
              >
                {/* Larger rectangular thumbnail - prioritize food images */}
                <div className="w-36 h-48 rounded-lg overflow-hidden bg-gray-800 relative shadow-lg">
                  {post.images && post.images.length > 0 ? (
                    <img 
                      src={post.images[0]} 
                      alt="Food"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x400?text=Food';
                      }}
                    />
                  ) : post.image ? (
                    <img 
                      src={post.image} 
                      alt="Chef"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x400';
                      }}
                    />
                  ) : (
                    getChefAvatar(post.name || 'Chef')
                  )}
                  
                  {/* No name overlay at the bottom */}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Full-screen Story - Image fills the screen better */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header with chef info */}
          <div className="p-4 flex items-center z-10">
            <div className="flex items-center flex-1">
              {activeStory.image ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  <img 
                    src={activeStory.image} 
                    alt={activeStory.name || 'Chef'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  {getChefAvatar(activeStory.name || 'Chef')}
                </div>
              )}
              
              <div className="ml-3">
                <h3 className="font-semibold text-white">
                  {activeStory.name || 'Chef'}
                </h3>
                <p className="text-xs text-gray-300">
                  {activeStory.timestamp || 'Just now'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveStory(null)}
              className="text-white p-2"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Story Content - Full screen image */}
          <div className="absolute inset-0 flex items-center justify-center">
            {activeStory.images && activeStory.images.length > 0 ? (
              <img 
                src={activeStory.images[0]} 
                alt={activeStory.content || 'Food image'}
                className="w-full h-full object-contain"
              />
            ) : activeStory.image ? (
              <img 
                src={activeStory.image} 
                alt={activeStory.content || 'Food image'}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="max-w-lg p-6 text-center">
                <p className="text-xl text-white">
                  {activeStory.content || 'Check out our latest culinary creation!'}
                </p>
                
                {activeStory.tags && activeStory.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {activeStory.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-sm px-3 py-1 rounded-full bg-gray-800 text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

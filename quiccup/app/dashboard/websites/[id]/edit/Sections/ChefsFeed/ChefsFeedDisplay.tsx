"use client";

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Heart, Star, ArrowRight, Clock, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { ChefPost } from '../../types'

interface ChefsFeedDisplayProps {
  posts?: ChefPost[]
}

export function ChefsFeedDisplay({ posts = [] }: ChefsFeedDisplayProps) {
  const { theme } = usePreviewTheme()
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const [selectedPost, setSelectedPost] = useState<ChefPost | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Default posts with clear image URLs
  const defaultPosts: ChefPost[] = [
    {
      id: '1',
      name: 'Chef Alex',
      content: 'Try our new signature dish - truffle-infused risotto with wild mushrooms!',
      images: ['https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'],
      tags: ['risotto', 'truffle'],
      timestamp: 'Just now'
    },
    {
      id: '2',
      name: 'Chef Maria',
      content: 'Today\'s special dessert: Deconstructed tiramisu with espresso gelato',
      images: ['https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRlc3NlcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'],
      tags: ['dessert', 'tiramisu'],
      timestamp: '2 hours ago'
    },
    {
      id: '3',
      name: 'Chef Jackson',
      content: 'Behind the scenes at today\'s special event. Preparing a 5-course tasting menu!',
      images: ['https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'],
      tags: ['event', 'tasting', 'preparation'],
      timestamp: 'Yesterday'
    },
    {
      id: '4',
      name: 'Chef Sophia',
      content: 'Try our new shawarma combo deal!',
      images: ['https://images.unsplash.com/photo-1561651823-34feb02250e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hhd2FybWF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'],
      tags: ['shawarma', 'combo', 'special'],
      timestamp: 'Last week'
    }
  ]
  
  const displayPosts = posts.length > 0 ? posts : defaultPosts
  
  // Reset image state when active story changes
  useEffect(() => {
    if (activeStoryIndex !== null) {
      setImageLoaded(false)
      setImageError(false)
    }
  }, [activeStoryIndex])
  
  // Function to safely get the first name
  const getFirstName = (fullName?: string) => {
    if (!fullName) return 'Chef';
    return fullName.split(' ')[0];
  }
  
  // Handle story progression
  useEffect(() => {
    if (activeStoryIndex !== null) {
      // Reset progress
      setProgress(0)
      
      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      
      // Set up progress interval
      const duration = 5000 // 5 seconds per story
      const interval = 50 // Update progress every 50ms
      const steps = duration / interval
      let currentProgress = 0
      
      progressInterval.current = setInterval(() => {
        currentProgress += (100 / steps)
        
        if (currentProgress >= 100) {
          // Move to next story
          if (activeStoryIndex < displayPosts.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1)
          } else {
            // Close stories view when reaching the end
            setActiveStoryIndex(null)
            if (progressInterval.current) {
              clearInterval(progressInterval.current)
            }
          }
        } else {
          setProgress(currentProgress)
        }
      }, interval)
      
      // Cleanup interval on unmount or story change
      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      }
    }
  }, [activeStoryIndex, displayPosts.length])
  
  // Navigate to next story
  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < displayPosts.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1)
    } else {
      setActiveStoryIndex(null) // Close if at the end
    }
  }
  
  // Navigate to previous story
  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1)
    }
  }
  
  // Close story view
  const closeStory = () => {
    setActiveStoryIndex(null)
  }
  
  // Function to get the avatar for a chef (first letter of their name in a colored circle)
  const getChefAvatar = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-lg">
        {firstLetter}
      </div>
    );
  }
  
  // Get first image from the images array
  const getFirstImage = (post: ChefPost) => {
    if (post.images && post.images.length > 0) {
      return post.images[0];
    }
    return null;
  }

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <div className={`pt-6 pb-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Chef Stories
        </h2>
        
        {/* Stories row - simplified without tabs and add highlight */}
        <div className="flex space-x-5 overflow-x-auto pb-4 hide-scrollbar px-1">
          {displayPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveStoryIndex(index)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                  {getFirstImage(post) ? (
                    <img 
                      src={getFirstImage(post) || ''} 
                      alt={post.name || 'Chef'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/160?text=Chef';
                      }}
                    />
                  ) : (
                    getChefAvatar(post.name || 'Chef')
                  )}
                </div>
                {/* Circle avatar in bottom right */}
                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden w-8 h-8 bg-gray-200">
                  {getChefAvatar(post.name || 'Chef')}
                </div>
              </div>
              <span className={`mt-2 text-xs font-medium text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {getFirstName(post.name || 'Chef')}
              </span>
            </div>
          ))}
        </div>
        
        {/* Story view (full screen overlay) */}
        <AnimatePresence>
          {activeStoryIndex !== null && (
            <motion.div 
              className="fixed inset-0 z-50 bg-black flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
                {displayPosts.map((_, index) => (
                  <div 
                    key={index} 
                    className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
                  >
                    {index === activeStoryIndex && (
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    )}
                    {index < activeStoryIndex && (
                      <div className="h-full bg-white w-full" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Chef info at top */}
              <div className="absolute top-8 left-0 right-0 z-40 flex items-center justify-center">
                <div className="bg-black/40 rounded-full px-4 py-2 flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {getChefAvatar(displayPosts[activeStoryIndex].name || 'Chef')}
                  </div>
                  <div className="ml-2 text-left">
                    <span className="text-white font-semibold text-sm">
                      {displayPosts[activeStoryIndex].name || 'Chef'}
                    </span>
                    <p className="text-gray-300 text-xs">
                      {displayPosts[activeStoryIndex].timestamp || 'Just now'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Close button */}
              <button 
                className="absolute top-8 right-8 z-50 p-2 rounded-full bg-black/30"
                onClick={closeStory}
              >
                <X className="w-6 h-6 text-white" />
              </button>
              
              {/* Story image - centered with better fallbacks */}
              <div className="w-full h-full flex items-center justify-center bg-black/50">
                {!imageError ? (
                  <img 
                    src={getFirstImage(displayPosts[activeStoryIndex]) || 'https://via.placeholder.com/800x600?text=No+Image'} 
                    alt="Story"
                    className={`max-h-[70vh] max-w-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      setImageError(true);
                      console.error("Failed to load image:", getFirstImage(displayPosts[activeStoryIndex]));
                    }}
                  />
                ) : (
                  <div className="text-white text-center p-8">
                    <p className="text-xl mb-4">Image could not be loaded</p>
                    <p>{displayPosts[activeStoryIndex].content}</p>
                  </div>
                )}
              </div>
              
              {/* Tags display */}
              <div className="absolute top-24 left-0 right-0 flex justify-center z-40">
                <div className="flex gap-2 flex-wrap justify-center">
                  {displayPosts[activeStoryIndex].tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-black/40 rounded-full text-white text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-base font-medium max-w-md mx-auto">
                  {displayPosts[activeStoryIndex].content || "Try our latest dishes!"}
                </p>
              </div>
              
              {/* Navigation zones */}
              <button 
                className="absolute left-0 top-0 h-full w-1/3 z-30"
                onClick={prevStory}
              />
              <button 
                className="absolute right-0 top-0 h-full w-1/3 z-30"
                onClick={nextStory}
              />
              
              {/* Navigation arrows */}
              <div className="hidden md:block">
                {activeStoryIndex > 0 && (
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 z-40"
                    onClick={prevStory}
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}
                {activeStoryIndex < displayPosts.length - 1 && (
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 z-40"
                    onClick={nextStory}
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Custom CSS to hide scrollbar but keep functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

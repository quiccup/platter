'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePreviewTheme } from '@/components/preview-theme-provider'

interface AboutDisplayProps {
  data?: {
    content?: string
    title?: string
    subtitle?: string
    image?: string
    story?: {
      title?: string
      content?: string
      image?: string
    }[]
  }
}

export function AboutDisplay({ data = {} }: AboutDisplayProps) {
  const { theme } = usePreviewTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [windowHeight, setWindowHeight] = useState(0)
  
  // Update window height on mount
  useEffect(() => {
    setWindowHeight(window.innerHeight)
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Scroll animations
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, windowHeight], [0, windowHeight * 0.3])
  const opacity = useTransform(scrollY, [0, windowHeight * 0.6], [1, 0])
  const scale = useTransform(scrollY, [0, windowHeight * 0.8], [1, 0.6])
  const titleOpacity = useTransform(scrollY, [0, windowHeight * 0.3], [1, 0])
  
  // Generate rays
  const generateRays = () => {
    const rays = []
    const rayCount = 20
    
    for (let i = 0; i < rayCount; i++) {
      const rotation = (i * (360 / rayCount))
      rays.push(
        <div 
          key={i}
          className="absolute h-full w-2 bg-gray-200 dark:bg-gray-700 opacity-40"
          style={{ 
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
        />
      )
    }
    
    return rays
  }
  
  // Debug output to check what data is received
  useEffect(() => {
    console.log('About Display Mounted, Data:', data);
  }, [data]);
  
  return (
    <div 
      ref={containerRef}
      className={`w-full relative z-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Hero Section with Animated Rays */}
      <div className="h-screen relative overflow-hidden flex items-center justify-center">
        {/* Rotating rays container */}
        <motion.div 
          className="absolute w-[150vw] h-[150vw] pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 120, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {generateRays()}
        </motion.div>
        
        {/* Center circular image */}
        <motion.div
          style={{ y, opacity, scale }}
          className="relative z-10 w-80 h-80 rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl"
        >
          {data.image ? (
            <img 
              src={data.image} 
              alt={data.title || 'About Us'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">
                {data.title?.[0] || 'A'}
              </span>
            </div>
          )}
        </motion.div>
        
        {/* Title overlay */}
        <motion.div 
          className="absolute inset-x-0 bottom-20 text-center px-6"
          style={{ opacity: titleOpacity }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            {data.title || 'ABOUT US'}
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
            {data.subtitle || 'Our story and journey'}
          </p>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 inset-x-0 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="opacity-60"
          >
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </motion.div>
      </div>
      
      {/* Default content section if no story sections */}
      {(!data.story || data.story.length === 0) && (
        <div className="min-h-screen flex items-center bg-gray-100 dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">About Us</h2>
              <div className="prose prose-lg mx-auto dark:prose-invert">
                <p>{data.content || 'Tell your story here. Share your journey, values, and mission with your audience.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Story Sections (scrolling content) */}
      {data.story && data.story.length > 0 && data.story.map((section, index) => (
        <div 
          key={index}
          className={`min-h-screen flex items-center py-20 ${
            index % 2 === 0
              ? 'bg-gray-100 dark:bg-gray-800'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                {section.image ? (
                  <img 
                    src={section.image} 
                    alt={section.title || 'Our Story'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600" />
                )}
              </div>
              
              <div className="w-full md:w-1/2 px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {section.title || 'Our Journey'}
                </h2>
                <div className="prose prose-lg dark:prose-invert">
                  <p>{section.content || data.content || 'Tell your story here. Share your journey, values, and mission with your audience.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

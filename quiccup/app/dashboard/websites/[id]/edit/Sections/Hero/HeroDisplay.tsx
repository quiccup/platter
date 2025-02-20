'use client'

import { useEffect, useState } from 'react'
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { motion, AnimatePresence } from 'framer-motion'

interface HeroData {
  heading: string
  subheading: string
  buttons: Array<{
    label: string
    url: string
    openInNewTab: boolean
  }>
  logo?: string
  coverImages: string[]
}

export function HeroDisplay({ data }: { data: HeroData }) {
  const [isMobile, setIsMobile] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Handle screen resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical md breakpoint
    }
    
    checkMobile() // Check on initial render
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const buttonCount = data.buttons?.length || 0
  const isMultipleButtons = buttonCount === 2

  return (
    <div className="bg-black relative">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        {/* Header Content */}
        <div className={`text-center ${isMobile ? 'pt-16' : 'pt-20 md:pt-24'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img 
                src={data.logo || '/placeholder-logo.png'}
                alt="Logo" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
              />
            </div>
            {/* Restaurant Name */}
            <h1 className="text-6xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              {data.heading}
            </h1>
          </div>
          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            {data.subheading}
          </p>

          {/* Action Buttons */}
          <div className={`max-w-xl mx-auto mb-8 md:mb-12
            ${isMultipleButtons ? 'flex gap-4' : 'space-y-4'}`}
          >
            {data.buttons?.slice(0, 2).map((button, index) => (
              <a
                key={index}
                href={button.url}
                target={button.openInNewTab ? '_blank' : '_self'}
                rel={button.openInNewTab ? 'noopener noreferrer' : ''}
                className={`block bg-white py-4 md:py-5 rounded-2xl text-base md:text-lg font-semibold
                  text-center uppercase tracking-wide text-black
                  transition-all duration-300 hover:bg-white/95
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
                  shadow-lg backdrop-blur-sm
                  ${isMultipleButtons ? 'flex-1' : 'w-full'}
                  ${isMultipleButtons ? 'text-sm md:text-base py-3.5 md:py-4' : ''}`}
              >
                {button.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stacked Cover Images */}
        <div className="mx-auto max-w-4xl pb-4 relative">
          <div className="relative h-[300px] md:h-[400px]">
            {data.coverImages?.slice(0, 3).map((image, index) => (
              <motion.div
                key={image}
                className="absolute inset-0 cursor-pointer"
                initial={false}
                animate={{
                  scale: 1 - (activeImageIndex > index ? 0.1 : 0),
                  y: (index - activeImageIndex) * 20,
                  zIndex: activeImageIndex === index ? 30 : 20 - index,
                  opacity: 1 - (activeImageIndex > index ? 0.3 : 0),
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image || '/placeholder-cover.jpg'}
                  alt={`Cover ${index + 1}`}
                  className="w-full h-full rounded-[2rem] shadow-2xl object-cover"
                />
                
                {/* Gradient overlay for inactive images */}
                {activeImageIndex !== index && (
                  <div 
                    className="absolute inset-0 rounded-[2rem] bg-black/20 
                      transition-opacity duration-300"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Image Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {data.coverImages?.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300
                  ${activeImageIndex === index 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/70'}`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
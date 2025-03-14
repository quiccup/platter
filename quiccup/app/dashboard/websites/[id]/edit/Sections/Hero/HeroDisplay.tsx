'use client'

import { useEffect, useState } from 'react'
import { ChefsFeedDisplay } from '../ChefsFeed/ChefsFeedDisplay'

interface HeroData {
  heading: string
  subheading: string
  buttons: Array<{
    label: string
    url: string
    openInNewTab: boolean
  }>
  logo?: string
  chefsFeed?: any // Add ChefsFeed data type
}

export function HeroDisplay({ data }: { data: HeroData }) {
  const [isMobile, setIsMobile] = useState(false)

  // Handle screen resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const buttonCount = data.buttons?.length || 0
  const isMultipleButtons = buttonCount === 2

  return (
    <div className="relative">
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
          <div className={`max-w-xl mx-auto mb-2 md:mb-3
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

        {/* ChefsFeed Display */}
        {/* <div className=" md:pt-12">
          <ChefsFeedDisplay data={data.chefsFeed} />
        </div> */}
      </div>
    </div>
  )
}
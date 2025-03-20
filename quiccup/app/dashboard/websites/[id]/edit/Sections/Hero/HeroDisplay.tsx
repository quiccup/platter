'use client'

import { motion } from 'framer-motion'
import { usePreviewTheme } from '@/components/preview-theme-provider'

interface HeroProps {
  heading: string
  subheading: string
  buttons: Array<{
    label: string
    url: string
    openInNewTab: boolean
  }>
  logo?: string
  coverImage?: string
}

export function HeroDisplay({ data }: { data: HeroProps }) {
  const { theme } = usePreviewTheme()
  
  // Extract properties from data with fallbacks
  const heading = data?.heading || 'Restaurant Name'
  const subheading = data?.subheading || ''
  const buttons = data?.buttons || []
  const coverImage = data?.coverImage

  return (
    <div className="relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover brightness-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
    </div>
  )
}
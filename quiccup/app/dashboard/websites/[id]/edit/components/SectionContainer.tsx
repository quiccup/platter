'use client'

import { usePreviewTheme } from '@/components/preview-theme-provider'

interface SectionContainerProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  alternateBackground?: boolean
  noPadding?: boolean
  fullWidth?: boolean
  className?: string
}

export function SectionContainer({
  children,
  title,
  subtitle,
  alternateBackground = false,
  noPadding = false,
  fullWidth = false,
  className = ''
}: SectionContainerProps) {
  const { theme } = usePreviewTheme()
  
  // Determine background colors based on theme and alternate setting
  const backgroundColor = alternateBackground
    ? theme === 'dark' 
      ? 'bg-gray-800' 
      : 'bg-gray-50'
    : theme === 'dark'
      ? 'bg-gray-900'
      : 'bg-white'
  
  // Determine text colors based on theme
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtitleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  
  return (
    <section className={`${backgroundColor} ${!noPadding ? 'py-16' : ''} ${className}`}>
      <div className={`${fullWidth ? '' : 'container mx-auto px-4'}`}>
        {title && (
          <div className="mb-10 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold ${textColor}`}>
              {title}
            </h2>
            
            {subtitle && (
              <p className={`mt-3 text-lg ${subtitleColor} max-w-2xl mx-auto`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {children}
      </div>
    </section>
  )
} 
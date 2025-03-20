'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface PreviewThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const PreviewThemeContext = createContext<PreviewThemeContextType | undefined>(undefined)

export function PreviewThemeProvider({ 
  children, 
  initialTheme = 'dark' 
}: { 
  children: ReactNode,
  initialTheme?: Theme
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  return (
    <PreviewThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </PreviewThemeContext.Provider>
  )
}

export function usePreviewTheme() {
  const context = useContext(PreviewThemeContext)
  if (context === undefined) {
    throw new Error('usePreviewTheme must be used within a PreviewThemeProvider')
  }
  return context
} 
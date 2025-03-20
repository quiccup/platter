'use client'

import { usePreviewTheme } from './preview-theme-provider'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

export function PreviewThemeToggle() {
  const { theme, toggleTheme } = usePreviewTheme()

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleTheme}
      className="gap-2"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Preview Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Preview Light Mode</span>
        </>
      )}
    </Button>
  )
} 
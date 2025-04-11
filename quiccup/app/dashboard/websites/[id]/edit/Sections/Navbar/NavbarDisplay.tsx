'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { AboutDisplay } from '../About/AboutDisplay'

interface NavBarProps {
  logo?: string
  companyName: string
  address: string
  onAddressChange?: (address: string) => void
  isEditing?: boolean
  aboutData?: any
}

export function NavbarDisplay({ 
  logo, 
  companyName, 
  address, 
  onAddressChange,
  isEditing = false,
  aboutData
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const { theme } = usePreviewTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = ['Home', 'Menu', 'About', 'Contact']

  return (
    <>
      {/* Main navigation bar */}
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b transition-colors duration-200 relative z-50`}>
        <div className="container mx-auto flex justify-between items-center py-3 px-4 md:py-4 md:px-6">
          {/* Left: Logo & company name - Simplified */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMenu}
              className="flex-shrink-0 focus:outline-none transition-transform duration-200 hover:scale-105"
            >
              {logo ? (
                <img 
                  src={logo} 
                  alt={companyName} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-red-600 flex items-center justify-center text-white font-bold text-lg md:text-xl">
                  {companyName?.charAt(0)}
                </div>
              )}
            </button>

            <div className="flex flex-col justify-center">
              <span className={`font-bold text-base md:text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {companyName}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => onAddressChange?.(e.target.value)}
                  placeholder="Enter your address"
                  className="text-[10px] md:text-xs bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                />
              ) : (
                <span className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {address || 'Add your restaurant address'}
                </span>
              )}
            </div>
          </div>
          
          {/* Right: Our Story & Order buttons - Show on both mobile and desktop with responsive styling */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStory(true)}
              className="flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
            >
              <span className="block md:hidden">Story</span>
              <span className="hidden md:block">Our Story</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center text-sm font-medium"
            >
              <span className="block md:hidden">Order</span>
              <span className="hidden md:block">Order Online</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Story Reveal Animation */}
      <AnimatePresence>
        {showStory && (
          <>
            <motion.div
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0, originY: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-orange-500 z-[60]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="fixed inset-0 z-[70] overflow-y-auto"
            >
              <button
                onClick={() => setShowStory(false)}
                className="fixed top-6 right-6 z-[80] text-white bg-black/20 p-2 rounded-full hover:bg-black/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <AboutDisplay data={aboutData} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile slide-out menu */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transform transition-transform duration-300 ease-in-out shadow-xl ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {companyName}
            </span>
            <button 
              onClick={toggleMenu} 
              className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <ul className="space-y-4 flex-1">
            {menuItems.map(item => (
              <li key={item}>
                <a href="#" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} block py-2 px-2 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Mobile menu footer buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setShowStory(true)
                  setIsMenuOpen(false)
                }}
                className="w-full border border-orange-500 text-orange-500 py-2.5 rounded-md flex items-center justify-center gap-2"
              >
                Our Story
              </button>
              <button className="w-full bg-black text-white py-2.5 rounded-md flex items-center justify-center gap-2">
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </>
  )
} 
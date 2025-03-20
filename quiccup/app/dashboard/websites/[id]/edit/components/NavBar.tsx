'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { usePreviewTheme } from '@/components/preview-theme-provider'

interface NavBarProps {
  logo?: string
  companyName: string
}

export function NavBar({ logo, companyName }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = usePreviewTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = ['Home', 'Menu', 'About', 'Contact']

  return (
    <>
      {/* Main navigation bar */}
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b transition-colors duration-200`}>
        <div className="container mx-auto flex justify-between items-center py-3 px-4 md:py-4 md:px-6">
          {/* Left: Menu toggle button */}
          <button 
            onClick={toggleMenu} 
            className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} focus:outline-none`}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Center: Logo & company name - responsive sizes */}
          <div className="flex items-center max-w-[60%]">
            {logo ? (
              <img src={logo} alt={companyName} className="h-8 w-auto mr-2 md:h-10 md:mr-3" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-base mr-2 md:h-10 md:w-10 md:text-lg md:mr-3 flex-shrink-0">
                {companyName && companyName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className={`font-bold text-base md:text-xl truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {companyName}
              </span>
              <span className={`text-[10px] md:text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                123 Restaurant Street, Foodville
              </span>
            </div>
          </div>
          
          {/* Right: Order now button - smaller on mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium"
          >
            <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Order Now</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile slide-out menu - improved styling */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transform transition-transform duration-300 ease-in-out shadow-xl ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 md:p-6 h-full flex flex-col">
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
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </button>
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
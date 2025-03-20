'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '../../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { Share2, Globe, Users, Crown, BarChart3 } from 'lucide-react'

export interface LeaderboardData {
  title: string
  subtitle?: string
  featuredItems: string[] // IDs of the menu items
}

export interface LeaderboardDisplayProps {
  data: any
  menuItems: MenuItem[]
}

export function LeaderboardDisplay({ data, menuItems = [] }: LeaderboardDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'new' | 'popular'>('popular')
  const { theme } = usePreviewTheme()
  
  // Safely extract featuredItems with fallbacks
  const featuredItems = data?.featuredItems || []
  
  // Filter menu items to only include the ones selected for the leaderboard
  const topItems = featuredItems
    .map(id => menuItems.find(item => item.title === id))
    .filter(Boolean) as MenuItem[]

  if (topItems.length === 0) {
    return null
  }

  // Total orders - for display purposes
  const totalOrders = 125684
  
  // Simulate orders for each item
  const getSimulatedOrders = (index: number) => {
    // Higher index means lower position in the ranking
    return Math.floor(Math.random() * 1000) + 5000 - (index * 200)
  }
  
  // Assign order counts to items
  const itemsWithOrders = topItems.map((item, index) => ({
    ...item,
    orders: getSimulatedOrders(index)
  }))

  // Get the top dish (first item)
  const topDish = itemsWithOrders[0]
  
  // Get medal based on position
  const getMedal = (position: number) => {
    switch(position) {
      case 0: return '🥇 1st Place';
      case 1: return '🥈 2nd Place';
      case 2: return '🥉 3rd Place';
      default: return `${position + 1}th Place`;
    }
  };

  return (
    <div className={`py-8 px-4 md:px-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'}`}>
      {/* Title moved outside the container */}
      <h2 className="text-l font-bold text-white mb-5 max-w-4xl mx-auto pl-2">Leaderboard</h2>
      
      {/* Desktop view with featured top dish */}
      <div className="hidden md:flex max-w-4xl mx-auto bg-gray-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Left side - Featured top dish */}
        {topDish && (
          <div className="w-2/5 bg-gray-700 p-8 flex flex-col items-center justify-center relative">
            <div className="absolute top-6 left-6">
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            
            {/* Top dish image */}
            <div className="mb-5 relative">
              {topDish.image ? (
                <img 
                  src={topDish.image} 
                  alt={topDish.title} 
                  className="w-28 h-28 rounded-full border-4 border-yellow-400 object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-yellow-400">
                  {topDish.title.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Score */}
            <h3 className="text-5xl font-bold text-white mb-2">{topDish.orders.toLocaleString()}</h3>
            
            {/* Dish name and position */}
            <div className="text-center">
              <p className="text-gray-300 text-lg">{topDish.title}</p>
              <div className="flex items-center justify-center gap-1 text-yellow-400 mt-1">
                <span>{getMedal(0)}</span>
              </div>
            </div>
            
            {/* View Stats button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-5 py-2 bg-orange-400 hover:bg-orange-500 text-black rounded-full flex items-center gap-2 font-medium"
            >
              <BarChart3 className="w-4 h-4" />
              View Stats
            </button>
          </div>
        )}
        
        {/* Right side - Leaderboard list */}
        <div className="w-3/5 p-6">
          {/* Toggle between New/Popular views */}
          <div className="flex rounded-full bg-gray-700 p-1 mb-6">
            <button
              onClick={() => setViewMode('popular')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-full ${
                viewMode === 'popular' ? 'bg-indigo-500 text-white' : 'text-gray-300'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Globe className="w-4 h-4" />
                Popular
              </span>
            </button>
            <button
              onClick={() => setViewMode('new')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-full ${
                viewMode === 'new' ? 'bg-indigo-500 text-white' : 'text-gray-300'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4" />
                New
              </span>
            </button>
            <button 
              className="ml-1 p-2 text-gray-300 rounded-full hover:bg-gray-600"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Leaderboard rankings list - skip the first item as it's featured */}
          <div className="space-y-3">
            <p className="text-gray-400 text-xs mb-4">
              Out of {totalOrders.toLocaleString()} total orders
            </p>
            
            {itemsWithOrders.slice(1).map((item, index) => (
              <div 
                key={item.title}
                className="flex items-center p-3 rounded-lg bg-gray-700/50"
              >
                <div className="flex-shrink-0 mr-3">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                      {item.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-white font-medium truncate">{item.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-1">
                    {getMedal(index + 1)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-white font-medium">{item.orders.toLocaleString()}</span>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full text-center py-3 text-gray-400 hover:text-white text-sm font-medium"
            >
              Show more
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile view - simplified version */}
      <div className="md:hidden max-w-md mx-auto bg-gray-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-5 py-6">
          {/* Toggle between New/Popular views */}
          <div className="flex rounded-full bg-gray-700 p-1 mb-6">
            <button
              onClick={() => setViewMode('popular')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-full ${
                viewMode === 'popular' ? 'bg-indigo-500 text-white' : 'text-gray-300'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Globe className="w-4 h-4" />
                Popular
              </span>
            </button>
            <button
              onClick={() => setViewMode('new')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-full ${
                viewMode === 'new' ? 'bg-indigo-500 text-white' : 'text-gray-300'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4" />
                New
              </span>
            </button>
            <button 
              className="ml-1 p-2 text-gray-300 rounded-full hover:bg-gray-600"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Featured item with special styling */}
          {itemsWithOrders.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4 relative">
                  {itemsWithOrders[0].image ? (
                    <img 
                      src={itemsWithOrders[0].image} 
                      alt={itemsWithOrders[0].title} 
                      className="w-16 h-16 rounded-full border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-yellow-400">
                      {itemsWithOrders[0].title.charAt(0)}
                    </div>
                  )}
                  <Crown className="absolute -top-2 -left-2 h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Rank #{itemsWithOrders.length > 4 ? 5 : itemsWithOrders.length}</h3>
                  <p className="text-gray-400 text-sm">{itemsWithOrders[0].orders.toLocaleString()} orders</p>
                </div>
              </div>
              <p className="text-gray-500 text-center text-xs mt-2">
                Out of {totalOrders.toLocaleString()} total orders
              </p>
            </div>
          )}
          
          {/* Leaderboard rankings list */}
          <div className="space-y-3">
            {itemsWithOrders.map((item, index) => (
              <div 
                key={item.title}
                className={`flex items-center p-3 rounded-lg ${
                  index === 0 ? 'bg-gray-700' : 'bg-gray-700/50'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                      {item.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-white font-medium truncate">{item.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-1">{item.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-white font-medium">{item.orders.toLocaleString()}</span>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full text-center py-3 text-gray-400 hover:text-white text-sm font-medium"
            >
              Show more
            </button>
          </div>
        </div>
      </div>
      
      {/* Details modal with all menu items */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Most Popular Menu Items</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {itemsWithOrders.map((item, index) => (
              <div key={item.title} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full font-bold text-xl text-gray-500">
                    #{index + 1}
                  </div>
                </div>
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        {item.title.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-bold">${item.price}</p>
                    <p className="text-gray-600 text-sm">{item.orders.toLocaleString()} orders</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

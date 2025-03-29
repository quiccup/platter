"use client"

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Sparkles } from 'lucide-react'
import { MenuItem } from '../../../types'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { Input } from '@/components/ui/input'

interface BudgetBasedTabProps {
  menuItems: MenuItem[]
  websiteId: string
}

export function BudgetBasedTab({ menuItems, websiteId }: BudgetBasedTabProps) {
  const { theme } = usePreviewTheme()
  const [budget, setBudget] = useState(30)
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [showFeatureHighlight, setShowFeatureHighlight] = useState(true)
  
  // Budget optimization algorithm
  const getBudgetBasedRecommendations = useMemo(() => {
    if (!menuItems?.length || budget <= 0) return []
    
    // Convert prices to numbers and filter out invalid ones
    const validItems = menuItems?.filter(item => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return !isNaN(price) && price > 0 && price <= budget
    })
    
    // Group items by category
    const categorizedItems = new Map();
    validItems.forEach(item => {
      if (item.tags && item.tags.length > 0) {
        const category = item.tags[0]; // Use first tag as primary category
        if (!categorizedItems.has(category)) {
          categorizedItems.set(category, []);
        }
        categorizedItems.get(category).push(item);
      } else {
        if (!categorizedItems.has('Uncategorized')) {
          categorizedItems.set('Uncategorized', []);
        }
        categorizedItems.get('Uncategorized').push(item);
      }
    });
    
    // Try to select items from different categories to maximize variety
    const result = [];
    let remainingBudget = budget;
    
    // First, try to get one item from each category
    const categories = Array.from(categorizedItems.keys());
    for (const category of categories) {
      const items = categorizedItems.get(category);
      if (items.length > 0) {
        const cheapestItem = items[0];
        const price = parseFloat(cheapestItem.price.replace(/[^0-9.]/g, ''));
        if (price <= remainingBudget) {
          result.push(cheapestItem);
          remainingBudget -= price;
          // Remove the selected item
          items.shift();
        }
      }
    }
    
    // Then, try to add more items until budget is exhausted
    // Create a flattened list of all remaining items
    const allRemainingItems = [];
    categorizedItems.forEach(items => {
      allRemainingItems.push(...items);
    });
    
    // Sort by price
    allRemainingItems.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
      return priceA - priceB;
    });
    
    // Add items until budget is exhausted
    for (const item of allRemainingItems) {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      if (price <= remainingBudget) {
        result.push(item);
        remainingBudget -= price;
      }
    }
    
    return result;
  }, [menuItems, budget])
  
  // Calculate total price of budget-based recommendations
  const totalBudgetBasedPrice = useMemo(() => {
    return getBudgetBasedRecommendations.reduce((total, item) => {
      return total + parseFloat(item.price.replace(/[^0-9.]/g, ''))
    }, 0).toFixed(2)
  }, [getBudgetBasedRecommendations])
  
  // Fetch AI recommendations when budget changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true)
        const response = await fetch(`/api/menu-recommendations/${websiteId}?budget=${budget}`)
        
        if (response.ok) {
          const data = await response.json()
          setAiRecommendations(data)
        } else {
          // Fall back to algorithmic recommendations
          setAiRecommendations(null)
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setAiRecommendations(null)
      } finally {
        setIsLoadingRecommendations(false)
      }
    }
    
    // Debounce to prevent too many requests
    const timeout = setTimeout(fetchRecommendations, 500)
    return () => clearTimeout(timeout)
  }, [budget, websiteId])
  
  // Close the feature highlight after 5 seconds
  useEffect(() => {
    if (showFeatureHighlight) {
      const timer = setTimeout(() => {
        setShowFeatureHighlight(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showFeatureHighlight])

  return (
    <motion.div
      key="budget-based"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Feature highlight banner */}
        {showFeatureHighlight && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              theme === 'dark' 
                ? 'bg-blue-900/30 border-blue-500 text-blue-200' 
                : 'bg-blue-50 border-blue-500 text-blue-800'
            }`}
          >
            <div className="flex items-start">
              <Sparkles className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Introducing Budget-Based Ordering</p>
                <p className="text-sm mt-1">
                  Our new AI-powered feature helps you get the most value within your budget. 
                  Just set your budget and we'll suggest the perfect combination!
                </p>
              </div>
              <button 
                onClick={() => setShowFeatureHighlight(false)}
                className="ml-auto flex-shrink-0 p-1 rounded-full hover:bg-black/10"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {/* Enhanced AI-powered budget search section */}
        <motion.div 
          className={`p-8 rounded-xl mb-8 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-gray-900/90 border-gray-700' 
              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
          } shadow-xl border-2`}
          initial={{ scale: 0.98, y: 20 }}
          whileInView={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <div className="flex items-center mb-6">
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="mr-3"
            >
              <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              AI Budget Planner
            </h3>
          </div>
          
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-xl`}>
            Our advanced AI analyzes thousands of meal combinations to create the perfect dining experience within your budget.
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="w-full max-w-md relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={5}
                max={200}
                className={`w-full pl-12 pr-4 py-6 text-xl font-bold rounded-l-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:bg-gray-600' 
                    : 'bg-white border-gray-200 text-gray-800 focus:bg-blue-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-16`}
                placeholder="Enter your budget"
              />
              
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                className={`absolute right-0 top-0 h-full px-8 flex items-center justify-center font-bold text-white rounded-r-full 
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  } transition-all duration-300 text-lg`}
              >
                <span className="mr-2">Find</span>
                <motion.div
                  animate={{ 
                    x: [0, 5, 0],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center px-3 py-1 rounded-full ${
              theme === 'dark' ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">AI-powered</span>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full ml-3 ${
              theme === 'dark' ? 'bg-purple-900/30 text-purple-200' : 'bg-purple-100 text-purple-800'
            }`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Instant results</span>
            </div>
          </div>
        </motion.div>
        
        {/* AI or Algorithmic Recommendations heading */}
        {isLoadingRecommendations ? (
          <div className="text-center py-4">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <p className="text-lg font-medium">Finding the perfect combination for you...</p>
            </motion.div>
          </div>
        ) : aiRecommendations ? (
          <div className="space-y-4">
            <motion.div 
              className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'} border ${
                theme === 'dark' ? 'border-blue-800' : 'border-blue-200'
              }`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-lg italic mb-4">{aiRecommendations.explanation}</p>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Sparkles className={`mr-2 h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                  <p className="font-medium">AI Recommended Combo</p>
                </div>
                <p className="font-bold">${aiRecommendations.totalPrice.toFixed(2)}</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Best combination for your budget
            </p>
            <motion.p 
              className="text-xl font-bold"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ${totalBudgetBasedPrice} <span className="text-sm font-normal text-gray-500">/ ${budget}</span>
            </motion.p>
          </div>
        )}
        
        {/* Recommendations display */}
        {isLoadingRecommendations ? (
          <div className="text-center py-12">
            <p>Loading recommendations...</p>
          </div>
        ) : aiRecommendations ? (
          <div className="space-y-6">
            {aiRecommendations.recommendedItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-bold">{item.title}</h4>
                      {item.tags && item.tags.length > 0 && (
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.tags[0]}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.description?.substring(0, 60)}
                      {item.description && item.description.length > 60 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <div className={`font-bold text-lg ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                  ${parseFloat(item.price).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : getBudgetBasedRecommendations.length > 0 ? (
          <div className="space-y-6">
            {getBudgetBasedRecommendations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.description?.substring(0, 60)}
                      {item.description && item.description.length > 60 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <div className={`font-bold text-lg ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                  ${parseFloat(item.price).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <p className="text-xl mb-4">No items fit your budget</p>
            <p className="mb-4">Try increasing your budget or check our menu for more options.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
} 
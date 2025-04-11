'use client'
import React, { useState } from 'react'
import { MenuItem } from '../../types'
import { Trophy, ArrowUpRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface LeaderboardData {
  title: string
  subtitle?: string
  featuredItems: string[] 
}

export interface LeaderboardDisplayProps {
  data: any
  menuItems: MenuItem[]
}

export function LeaderboardDisplay({ data, menuItems = [] }: LeaderboardDisplayProps) {
  const [flippedCard, setFlippedCard] = useState<number | null>(null)

  const topItems = (data?.featuredItems || [])
    .map((id: string) => menuItems.find(item => item.title === id))
    .filter(Boolean)
    .slice(0, 3) as MenuItem[]

  if (topItems.length === 0) return null

  const cardStyles = [
    'bg-[#F7D795] text-black', // Yellow card
    'bg-[#E87C6E] text-black', // Coral/Red card
    'bg-[#F7B7D4] text-black', // Pink card
  ]

  return (
    <div className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-0 md:px-4">
        {/* <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8" />
          Platter Picks
        </h2> */}

        <div className="flex flex-nowrap gap-3 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {topItems.map((item, index) => (
            <div 
              key={item.title} 
              className="h-[500px] md:h-[600px] perspective-1000 min-w-[260px] md:min-w-[300px] w-[75vw] md:w-auto snap-center first:ml-2 last:mr-2 md:first:ml-0 md:last:mr-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                {flippedCard === index ? (
                  // Back of card
                  <motion.div
                    key="back"
                    initial={{ rotateY: -180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 180, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`${cardStyles[index]} rounded-3xl p-5 md:p-8 h-full flex flex-col relative preserve-3d shadow-[0_2px_8px_rgba(0,0,0,0.1)]`}
                  >
                    <button
                      onClick={() => setFlippedCard(null)}
                      className="absolute top-6 right-6 z-10"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    
                    <div className="h-full flex flex-col">
                      <h3 className="text-2xl font-bold mb-4 font-display">
                        {item.title}
                      </h3>
                      
                      <div className="mb-4">
                        <span className="text-2xl font-bold">
                          ${item.price}
                        </span>
                      </div>

                      {/* Full description */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <p className="text-base/relaxed opacity-80 whitespace-pre-wrap">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Front of card
                  <motion.div
                    key="front"
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -180, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`${cardStyles[index]} rounded-3xl p-5 md:p-8 h-full flex flex-col relative preserve-3d shadow-[0_2px_8px_rgba(0,0,0,0.1)]`}
                  >
                    <div className="h-[80px] md:h-[100px] flex justify-between items-start">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 font-display">
                          #{index + 1} Most Popular
                        </h3>
                        <p className="text-xs md:text-sm text-black/70">
                          {index === 0 ? 'Customer Favorite' : `${90 - index * 10}% Love Rate`}
                        </p>
                      </div>
                      <button
                        onClick={() => setFlippedCard(index)}
                        className="transform transition-transform hover:scale-110"
                      >
                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </div>

                    <div className="h-[200px] md:h-[250px] w-full rounded-2xl overflow-hidden bg-white mb-4 md:mb-6">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/5">
                          <span className="text-4xl">🍽️</span>
                        </div>
                      )}
                    </div>

                    <div className="h-[180px] md:h-[200px] flex flex-col">
                      <h4 className="text-lg md:text-xl font-bold mb-2">
                        {item.title}
                      </h4>
                      
                      <div className="mb-2 md:mb-3">
                        <span className="text-xl md:text-2xl font-bold">
                          ${item.price}
                        </span>
                      </div>

                      <p className="text-sm md:text-base/relaxed opacity-80 line-clamp-4">
                        {item.description}
                      </p>

                      <div className="mt-auto pt-3 md:pt-4">
                        <div className="text-xs md:text-sm font-medium border-t border-black/10 pt-3 md:pt-4">
                          {index === 0 ? "Most ordered this week" : 
                           index === 1 ? "Trending upward" : 
                           "Highly rated"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add these styles to your global CSS
const styles = `
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
`

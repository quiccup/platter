'use client'
import React from 'react'
import { MenuItem } from '../../types'
import { Trophy } from 'lucide-react'

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
  const topItems = (data?.featuredItems || [])
    .map((id: string) => menuItems.find(item => item.title === id))
    .filter(Boolean)
    .slice(0, 3) as MenuItem[]

  if (topItems.length === 0) return null

  const itemsWithProgress = topItems.map((item, index) => ({
    ...item,
    progress: index === 0 ? 100 : Math.floor(Math.random() * (85 - 70) + 70)
  }))

  return (
    <div className="relative p-8 bg-[#111827] text-white min-h-[500px] overflow-hidden">
      {/* Decorative circles - slightly lighter than background */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#1f2937]" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#1f2937]" />
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-[#1f2937]" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-16">
        <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        <Trophy className="w-8 h-8 text-yellow-400" />
      </div>

      {/* Featured Winner */}
      {itemsWithProgress[0] && (
        <div className="mb-16 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              {itemsWithProgress[0].image ? (
                <img 
                  src={itemsWithProgress[0].image} 
                  alt={itemsWithProgress[0].title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-gray-700 text-white">
                  {itemsWithProgress[0].title.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className="text-2xl font-bold text-white">{itemsWithProgress[0].title}</h3>
            <div className="bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
              1
            </div>
          </div>
          <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm">
            100% completed
          </div>
        </div>
      )}

      {/* Runner-ups List */}
      <div className="space-y-4 max-w-xl mx-auto">
        {itemsWithProgress.slice(1).map((item, index) => (
          <div 
            key={item.title}
            className={`flex items-center gap-4 p-4 rounded-xl ${
              index === 0 ? 'bg-white' : 'bg-[#1f2937]'
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold bg-gray-200 text-gray-600">
                  {item.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`font-bold ${index === 0 ? 'text-black' : 'text-white'}`}>
                  {item.title}
                </h4>
                <div className={`w-6 h-6 rounded-full ${
                  index === 0 ? 'bg-purple-200' : 'bg-yellow-200'
                } flex items-center justify-center font-bold text-black text-sm`}>
                  {index + 2}
                </div>
              </div>
              <div className={`text-sm ${index === 0 ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.progress}% completed
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

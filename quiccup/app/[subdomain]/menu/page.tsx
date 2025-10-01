'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { menuService } from '@/lib/services/menuService'
import { Clock, Plus } from 'lucide-react'
import Image from 'next/image'

interface MenuItem {
  id: string
  user_id: string
  name: string
  price: number
  description?: string
  image_url?: string
  tags?: string[]
  created_at?: string
}

interface RestaurantData {
  id: string
  subdomain: string
  restaurant_name: string
  content: any
  is_published: boolean
}

// Mock categories for now - you can make these dynamic later
const foodCategories = [
  { name: 'Burger', icon: '🍔' },
  { name: 'Ramen', icon: '🍜' },
  { name: 'Salad', icon: '🥗' },
  { name: 'Cake', icon: '🍰' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Pasta', icon: '🍝' },
]

export default function MenuPage() {
  const params = useParams()
  const subdomain = params.subdomain as string
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    loadRestaurantData()
  }, [subdomain])

  const loadRestaurantData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Look up restaurant by subdomain
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (userError || !userData) {
        setError('Restaurant not found')
        return
      }

      // Fetch menu items for this user using MenuService
      const { data: items, error: menuError } = await menuService.getMenuItems(userData.id)

      if (menuError) {
        console.error('Error loading menu items:', menuError)
        setError('Failed to load menu items')
        return
      }

      setRestaurantData({
        id: userData.id,
        subdomain: userData.subdomain,
        restaurant_name: userData.restaurant_name || 'Restaurant',
        content: userData.content || {},
        is_published: userData.is_published
      })

      setMenuItems(items || [])
    } catch (err) {
      console.error('Error loading restaurant:', err)
      setError('Failed to load restaurant data')
    } finally {
      setLoading(false)
    }
  }

  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => 
        item.tags?.includes(selectedCategory.toLowerCase()) || 
        item.name.toLowerCase().includes(selectedCategory.toLowerCase())
      )

  const addToCart = (item: MenuItem) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', item)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error || !restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurantData.restaurant_name}
          </h1>
          <p className="text-gray-600">Explore our delicious menu</p>
        </div>

        {/* Food Category Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Food Category</h2>
            <span className="text-orange-500 text-sm cursor-pointer hover:underline">
              See more →
            </span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <div 
              className={`flex flex-col items-center min-w-[80px] cursor-pointer transition-colors ${
                selectedCategory === 'All' ? 'text-orange-500' : 'text-gray-600'
              }`}
              onClick={() => setSelectedCategory('All')}
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2">
                🍽️
              </div>
              <span className="text-sm font-medium">All</span>
            </div>
            {foodCategories.map((category) => (
              <div 
                key={category.name}
                className={`flex flex-col items-center min-w-[80px] cursor-pointer transition-colors ${
                  selectedCategory === category.name ? 'text-orange-500' : 'text-gray-600'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2">
                  {category.icon}
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Food For You</h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu items found for this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>15 mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>500 Kal</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description || 'Delicious dish from our kitchen'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Eye, 
  ArrowUpRight,
  DollarSign,
  UtensilsCrossed,
  Star,
  Target,
  Globe,
  Edit3,
  Image,
  ChefHat,
  Info,
  PhoneCall,
  Trophy,
  Home
} from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuEditor } from './components/MenuEditor'
import { GalleryEdit } from './components/GalleryEdit'
import { AboutEdit } from './components/AboutEdit'
import { ContactEdit } from './components/ContactEdit'
import { ReviewsEdit } from './components/ReviewsEdit'
import { NavbarEdit } from './components/NavbarEdit'
import { LeaderboardEdit } from './components/LeaderboardEdit'
import { ChefsFeedEdit } from './components/ChefsFeedEdit'
import { WebsiteData } from './types'

interface UserWebsite {
  id: string
  subdomain: string
  restaurant_name: string
  created_at: string
  is_published: boolean
}

interface AnalyticsData {
  totalVisitors: number
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  conversionRate: number
  topMenuItems: Array<{
    name: string
    orders: number
    revenue: number
    percentage: number
  }>
  monthlyTraffic: Array<{
    month: string
    visitors: number
    orders: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    customer: string
    items: string
    total: number
    status: 'completed' | 'pending' | 'cancelled'
    date: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [userWebsite, setUserWebsite] = useState<UserWebsite | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    navbar: {
      heading: '',
      subheading: '',
      buttons: [],
    },
    menu: {
      items: []
    },
    chefs: {
      posts: []
    },
    about: {
      content: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    gallery: {
      images: [],
      captions: {}
    },
    reviews: []
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadWebsiteData() {
      if (!user) return
      
      try {
        const supabase = createClient()

        // Get the user's website data directly from users table
        // First get the user record
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (userError) {
          console.error('Error fetching user data:', userError)
          setLoading(false)
          return
        }

        if (userData) {
          setUserWebsite({
            id: userData.id,
            subdomain: userData.subdomain,
            restaurant_name: userData.restaurant_name,
            created_at: userData.created_at,
            is_published: userData.is_published
          })
          
          // Load website content data directly from user record
          if (userData.content) {
            setWebsiteData(userData.content)
          }
          
          // For now, generate mock analytics data
          // In the future, this would come from actual analytics tracking
          const mockAnalytics: AnalyticsData = {
            totalVisitors: 1247,
            totalOrders: 89,
            totalRevenue: 12406,
            averageOrderValue: 139.39,
            conversionRate: 7.1,
            topMenuItems: [
              { name: "Beef Shawarma Wrap", orders: 23, revenue: 344.77, percentage: 25.8 },
              { name: "French Toast King", orders: 18, revenue: 454.22, percentage: 20.2 },
              { name: "Grilled Chicken Salad", orders: 15, revenue: 224.85, percentage: 16.9 },
              { name: "Lamb Kebab", orders: 12, revenue: 179.88, percentage: 14.6 },
              { name: "Falafel Bowl", orders: 10, revenue: 149.90, percentage: 12.5 }
            ],
            monthlyTraffic: [
              { month: "Jan", visitors: 156, orders: 12, revenue: 1672.68 },
              { month: "Feb", visitors: 189, orders: 15, revenue: 2090.85 },
              { month: "Mar", visitors: 203, orders: 18, revenue: 2508.02 },
              { month: "Apr", visitors: 178, orders: 14, revenue: 1946.26 },
              { month: "May", visitors: 234, orders: 20, revenue: 2787.80 },
              { month: "Jun", visitors: 267, orders: 10, revenue: 1400.39 }
            ],
            recentOrders: [
              { id: "#001", customer: "John Smith", items: "Beef Shawarma Wrap", total: 14.99, status: 'completed', date: "Jul 21, 2024" },
              { id: "#002", customer: "Sarah Johnson", items: "French Toast King", total: 25.29, status: 'completed', date: "Jul 21, 2024" },
              { id: "#003", customer: "Mike Davis", items: "Lamb Kebab", total: 18.99, status: 'pending', date: "Jul 20, 2024" },
              { id: "#004", customer: "Lisa Wilson", items: "Falafel Bowl", total: 14.99, status: 'completed', date: "Jul 20, 2024" },
              { id: "#005", customer: "Tom Brown", items: "Grilled Chicken Salad", total: 16.99, status: 'cancelled', date: "Jul 19, 2024" }
            ]
          }
          
          setAnalytics(mockAnalytics)
        }
      } catch (error) {
        console.error('Error loading website data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadWebsiteData()
  }, [user])

  const handleContentChange = (section: string, data: any) => {
    setWebsiteData(prev => ({
      ...prev,
      [section]: data
    }))
    setHasUnsavedChanges(true)
  }

  const saveAllChanges = async () => {
    if (!user) return
    
    try {
      setIsSaving(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('users')
        .update({
          content: websiteData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userWebsite.id)

      if (error) throw error
      
      setHasUnsavedChanges(false)
      // You could add a toast notification here
    } catch (error) {
      console.error('Error saving changes:', error)
      // You could add an error toast here
    } finally {
      setIsSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!userWebsite) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Website Found</h1>
          <p className="text-gray-600 mb-8">You need to create a website first to view analytics.</p>
          <Link 
            href="/dashboard/create"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <UtensilsCrossed className="h-5 w-5" />
            Create Your Restaurant Website
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10" />
            <div className="text-gray-900 text-2xl font-semibold">platter</div>
          </div>
        
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8">
              <Link href="/dashboard" className="text-orange-500 border-b-2 border-orange-500 pb-2">Dashboard</Link>
              <Link href={`/dashboard/settings`} className="text-gray-600 hover:text-gray-900 transition-colors">Settings</Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button 
                onClick={() => signOut().then(() => router.push('/sign-in'))}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Analytics for {userWebsite.restaurant_name}</p>
              <p className="text-sm text-gray-500">{userWebsite.subdomain}.platter.com</p>
            </div>
            <div className="flex gap-3">
                              <Button
                  onClick={() => router.push(`/restaurant/${userWebsite.subdomain}`)}
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                <Globe className="h-4 w-4" />
                View Restaurant Website
              </Button>
              <Button
                onClick={saveAllChanges}
                disabled={isSaving || !hasUnsavedChanges}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    {hasUnsavedChanges ? 'Save Changes' : 'All Changes Saved'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics?.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+27.4%</span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalOrders}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+10.0%</span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Website Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalVisitors.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+15.2%</span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+2.1%</span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Website Editor Tabs */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Tabs defaultValue="navbar" className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="navbar" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Navbar</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Top Dishes</span>
                </TabsTrigger>
                <TabsTrigger value="menu" className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span className="hidden sm:inline">Menu</span>
                </TabsTrigger>
                <TabsTrigger value="chefs" className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  <span className="hidden sm:inline">Chefs</span>
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Gallery</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  <span className="hidden sm:inline">Contact</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Reviews</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="navbar">
                <NavbarEdit 
                  data={websiteData.navbar} 
                  onChange={(data) => handleContentChange('navbar', data)} 
                />
              </TabsContent>
              
              <TabsContent value="leaderboard">
                <LeaderboardEdit 
                  data={websiteData.leaderboard} 
                  onChange={(data) => handleContentChange('leaderboard', data)} 
                />
              </TabsContent>
              
              <TabsContent value="menu">
                <MenuEditor userId={userWebsite.id} />
              </TabsContent>
              
              <TabsContent value="chefs">
                <ChefsFeedEdit 
                  data={websiteData.chefs} 
                  onChange={(data) => handleContentChange('chefs', data)} 
                />
              </TabsContent>
              
              <TabsContent value="gallery">
                <GalleryEdit 
                  data={websiteData.gallery} 
                  onChange={(data) => handleContentChange('gallery', data)} 
                />
              </TabsContent>
              
              <TabsContent value="about">
                <AboutEdit 
                  data={websiteData.about} 
                  onChange={(data) => handleContentChange('about', data)} 
                />
              </TabsContent>
              
              <TabsContent value="contact">
                <ContactEdit 
                  data={websiteData.contact} 
                  onChange={(data) => handleContentChange('contact', data)} 
                />
              </TabsContent>
              
              <TabsContent value="reviews">
                <ReviewsEdit 
                  data={websiteData.reviews} 
                  onChange={(data) => handleContentChange('reviews', data)} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Traffic Chart */}
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Traffic</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
              </select>
            </div>
            <div className="space-y-4">
              {analytics?.monthlyTraffic.map((month, index) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(month.visitors / Math.max(...analytics.monthlyTraffic.map(m => m.visitors))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">{month.visitors}</div>
                  <div className="w-20 text-right text-sm text-gray-600">${month.revenue}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Menu Items Chart */}
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Menu Items</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="space-y-4">
              {analytics?.topMenuItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-orange-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.items}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">${order.total}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
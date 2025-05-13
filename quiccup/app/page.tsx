// This is the main landing page
'use client'
import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChartBar, Users, TrendingUp, ShoppingCart, Clock, ChefHat } from 'lucide-react'

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  
  return (
    <div className="h-screen bg-yellow-400 text-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center relative shadow-md">
            <div className="absolute h-4 w-4 bg-orange-500 rounded-full -translate-x-1 translate-y-1"></div>
            <div className="absolute h-4 w-4 bg-orange-400 rounded-full translate-x-1 translate-y-1"></div>
            <div className="absolute h-4 w-4 bg-orange-300 rounded-full translate-y-0"></div>
          </div>
          <div className="text-2xl font-bold text-gray-900">platter</div>
        </div>
        
        {isSignedIn ? (
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-yellow-400 font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className="px-5 py-3 rounded-full bg-gray-900 text-yellow-400 font-medium hover:bg-gray-800 transition-colors shadow-md">
              Try it free
            </button>
          </SignInButton>
        )}
      </nav>
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 items-center">
        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900 text-left">
              Unlock the full potential of your restaurant menu
            </h1>
            <p className="text-xl mb-4 text-gray-800 max-w-xl text-left">
              Get more out of your customers using our intelligent AI food recommendation
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-300 text-gray-900 font-medium mb-6 shadow-sm">
              AI restaurant service !
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <SignInButton mode="modal">
                <button className="px-8 py-4 rounded-full bg-gray-900 text-yellow-400 font-medium hover:bg-gray-800 transition-colors shadow-md text-lg flex items-center justify-center gap-2">
                  Get started now
                  <ArrowRight className="h-5 w-5" />
                </button>
              </SignInButton>
              <Link href="#" className="px-8 py-4 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors shadow-md text-lg flex items-center justify-center">
                See demo
              </Link>
            </div>
          </motion.div>
          
          {/* Feature List */}
          <motion.div 
            className="grid grid-cols-2 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <ChartBar className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                <p className="text-sm text-gray-800">Track customer behavior in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <Users className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Customer Profiles</h3>
                <p className="text-sm text-gray-800">Build detailed preference history</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <ShoppingCart className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Upselling</h3>
                <p className="text-sm text-gray-800">AI-powered item recommendations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Peak Hour Insights</h3>
                <p className="text-sm text-gray-800">Optimize staffing & inventory</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Right Column - Image */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-0.5 bg-white rounded-2xl blur-md"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-900">Customer Preferences and Trends</h3>
                </div>
                <div className="flex gap-1">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Most Ordered Items</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-700">Spicy Tuna Roll</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-700">Chicken Parmesan</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">Caesar Salad</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-2/5 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Customer Traffic by Hour</h4>
                  <div className="flex items-end h-20 gap-1">
                    {[25, 35, 45, 75, 95, 65, 55, 85, 75, 45, 35, 25].map((height, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${height}%` }} 
                        className="flex-1 bg-yellow-500 rounded-t"
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>11am</span>
                    <span>9pm</span>
                  </div>
                </div>
                
                <button className="w-full p-3 rounded-lg bg-yellow-500 text-gray-900 font-medium hover:bg-yellow-400 transition-colors">
                  View Detailed Report
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-4 text-center text-gray-800 text-sm">
        <p>© 2024 platter. Helping restaurants increase sales through intelligent website design.</p>
      </footer>
    </div>
  )
} 
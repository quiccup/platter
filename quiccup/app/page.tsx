// This is the main landing page
'use client'
import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Github, Twitter, Instagram, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-800 rounded-full flex items-center justify-center relative">
            <div className="absolute h-4 w-4 bg-orange-500 rounded-full -translate-x-1 translate-y-1 opacity-80"></div>
            <div className="absolute h-4 w-4 bg-orange-400 rounded-full translate-x-1 translate-y-1 opacity-80"></div>
            <div className="absolute h-4 w-4 bg-orange-300 rounded-full translate-y-0 opacity-80"></div>
          </div>
          <div className="text-xl font-medium text-gray-200">platter</div>
        </div>
        
        {isSignedIn ? (
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button className="px-5 py-2 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors">
            Download
          </button>
        )}
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 flex flex-col items-center justify-center py-24 text-center">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          A game-changing restaurant website builder.
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-400 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create, manage, and conquer your restaurant online presence with ease
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isSignedIn ? (
            <Link 
              href="/dashboard" 
              className="px-8 py-4 rounded-full bg-gray-800 text-gray-100 font-medium hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="px-8 py-4 rounded-full bg-gray-800 text-gray-100 font-medium hover:bg-gray-700 transition-colors">
                Get started for free
              </button>
            </SignInButton>
          )}
          <div className="text-gray-500 text-sm mt-3">v1.0.1 • macOS 12+</div>
        </motion.div>
      </section>
      
      {/* App Screenshot */}
      <motion.section 
        className="container mx-auto px-6 mb-24 flex justify-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30"></div>
          <div className="relative z-10 flex">
            {/* Left sidebar */}
            <div className="w-48 border-r border-gray-800 p-4">
              <div className="mb-6">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 text-sm">
                  <div className="h-5 w-5 rounded-full bg-gray-700"></div>
                  <span>Today</span>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 text-sm">
                  <div className="h-5 w-5 rounded-full bg-gray-700"></div>
                  <span>Menu</span>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 p-2 rounded bg-gray-800 text-sm">
                  <div className="h-5 w-5 rounded-full bg-gray-700"></div>
                  <span>Feed</span>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 text-sm">
                  <div className="h-5 w-5 rounded-full bg-gray-700"></div>
                  <span>Gallery</span>
                </div>
              </div>
            </div>
            
            {/* Content area */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-medium">Upcoming</h2>
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-lg">+</span>
                </div>
              </div>
              
              {/* Task items */}
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 border border-gray-800 rounded-lg">
                    <div className="h-6 w-6 rounded-full border border-gray-600"></div>
                    <span className="flex-1">Update lunch menu items</span>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded bg-gray-800"></div>
                      <div className="h-6 w-6 rounded bg-gray-800"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex items-center text-gray-600 text-sm">
                <div className="h-4 w-4 rounded-full border border-gray-700 mr-2"></div>
                <span>COMPLETED 1/5</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-gray-800 rounded-full flex items-center justify-center relative">
            <div className="absolute h-4 w-4 bg-orange-500 rounded-full -translate-x-1 translate-y-1 opacity-80"></div>
            <div className="absolute h-4 w-4 bg-orange-400 rounded-full translate-x-1 translate-y-1 opacity-80"></div>
            <div className="absolute h-4 w-4 bg-orange-300 rounded-full translate-y-0 opacity-80"></div>
          </div>
                <span className="font-medium">platter</span>
              </div>
              <p className="text-gray-400 text-sm">
                The simplest way to manage your restaurant's online presence.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">© 2023 Platter. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 
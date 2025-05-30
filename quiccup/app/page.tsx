// This is the main landing page
'use client'
import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import Logo from '@/components/Logo'

export default function LandingPage() {
  const { isSignedIn } = useUser();
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden font-montserrat relative">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
        <Logo />
        <div className="text-white text-2xl font-semibold">platter</div>
        </div>
  
        
        {isSignedIn ? (
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-md"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className="px-5 py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-md">
              Try it free
            </button>
          </SignInButton>
        )}
      </nav>
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto flex flex-col items-center justify-center px-6 z-10 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Conversational AI for better food ordering
          </h1>
          
          <p className="text-xl mb-10 text-gray-400 max-w-3xl mx-auto">
            Drive restaurant sales by showing customers the full potential of your menu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignInButton mode="modal">
              <button className="px-8 py-4 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-lg text-lg flex items-center justify-center gap-2">
                Get started now
                <ArrowRight className="h-5 w-5" />
              </button>
            </SignInButton>
            
            <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} 
              className="px-8 py-4 rounded-full bg-transparent border border-gray-600 text-white font-medium hover:bg-gray-900 transition-colors text-lg flex items-center justify-center gap-2">
              Request a demo
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
        
        {/* Example chat interface */}
        <motion.div
          className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-2 text-sm text-gray-400">Restaurant AI Assistant</div>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-gray-800 text-white p-3 rounded-xl rounded-tl-none max-w-[80%]">
              What are your best options for a group of 4 with a budget of $60?
            </div>
            
            <div className="bg-orange-500 text-white p-3 rounded-xl rounded-tr-none max-w-[80%] ml-auto">
              For a group of 4 with a $60 budget, I'd recommend our Family Feast which includes:
              <ul className="mt-2 pl-4 list-disc">
                <li>1 large pizza (choice of 3 toppings)</li>
                <li>6 chicken wings</li>
                <li>1 family size salad</li>
                <li>4 soft drinks</li>
              </ul>
              <p className="mt-2">Total: $52.99 + tax</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-800 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask anything about our menu..."
              className="bg-gray-800 border-none outline-none flex-1 p-2 rounded-full text-white text-sm px-4"
            />
            <button className="bg-orange-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-4 text-center text-gray-500 text-sm z-10 relative border-t border-gray-800">
        <p>© 2024 platter. AI-powered chatbot for restaurants that helps customers discover dishes they'll love.</p>
      </footer>
    </div>
  )
} 
'use client'

import { useAuth } from '@/providers/auth-provider'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" color="white" />
            <div className="text-white text-2xl font-semibold">platter</div>
          </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => signOut().then(() => router.push('/'))}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Your Restaurant Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Manage your restaurant website, menu, and online presence all in one place.
            </p>
            <Button size="lg" onClick={() => router.push('/dashboard')}>
              <ArrowRight className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <div className="text-slate-900 text-xl font-medium">platter</div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 text-sm font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-32">
        {/* Hero Section */}
        <div className="text-center">
          
          {/* Main Heading */}
                      <h1 className="text-[85px] font-montserrat font-bold text-slate-900 mb-8 tracking-tight leading-[1.1] max-w-[900px] mx-auto">
              AI Chatbots to upsell your menu!
            </h1>

            <p className="text-slate-600 text-xl font-lato mb-12 max-w-xl mx-auto leading-relaxed">
            Let us show your customers what your menu is really about!
            </p>

          
        </div>

        {/* Waitlist Section */}
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2 text-left">
              Join the waitlist
            </h2>
            <p className="text-slate-600 text-sm mb-5 text-left leading-relaxed">
              Sign up to be one of the first to use Platter.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="w-9 h-9 bg-blue-600 text-white hover:bg-blue-700 rounded-lg p-0 flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12">
        <div className="text-slate-400 text-xs">
          <span>Designer & Developer</span>
          <span className="mx-2">•</span>
          <span>Platter Team</span>
        </div>
      </footer>
    </div>
  )
} 
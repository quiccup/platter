'use client'

import { useAuth } from '@/providers/auth-provider'
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

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
          <Link href="/demo">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 text-sm font-medium">
              View Demo
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-32">
        {/* Hero Section */}
        <div className="text-center">
          
          {/* Main Heading */}
                      <h1 className="text-[50px] font-montserrat font-bold text-slate-900 mb-8 tracking-tight leading-[1.1] max-w-[900px] mx-auto">
              AI Agents that sell food better than humans!
            </h1>

            <p className="text-slate-600 text-xl font-lato mb-12 max-w-xl mx-auto leading-relaxed">
            Let us show your customers what your menu is really about!
            </p>

          
        </div>

        {/* Waitlist Section */}
        <WaitlistBlock />
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

const WaitlistBlock = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || status === 'submitting') return

    setStatus('submitting')

    setTimeout(() => {
      setStatus('success')

      setTimeout(() => {
        setStatus('idle')
        setEmail('')
      }, 1800)
    }, 1500)
  }

  return (
    <div className="relative mx-auto mt-16 w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_#f7d8ff,_#f4cfff_45%,_#fbe1ff)] p-[1px] shadow-[0_20px_45px_-20px_rgba(139,92,246,0.45)]">
      <div className="relative rounded-[32px] bg-white/40 px-10 py-12 backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -left-10 h-40 w-40 rounded-full bg-white/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-14 h-48 w-48 rounded-full bg-[#fbe9ff]/70 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold tracking-tight text-[#4b2b2b]">
            Join the waitlist
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[#4b2b2b]/70">
            Be first in line when Platter launches with our beta partners. We’ll send early access invitations soon.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex-1 rounded-full border border-white/80 bg-white/80 px-6 py-4 shadow-inner focus-within:border-[#4b2b2b]/30 focus-within:ring-2 focus-within:ring-[#4b2b2b]/20">
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@email.com"
                className="w-full bg-transparent text-lg text-[#3b2727] placeholder:text-[#3b2727]/40 focus:outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="group relative flex h-14 w-full items-center justify-center rounded-full bg-[#231f20] px-8 text-base font-semibold text-white shadow-lg transition hover:bg-black sm:w-auto"
            >
              {status === 'submitting' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : status === 'success' ? (
                <span className="flex items-center gap-2">
                  Joined!
                  <ArrowRight className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Join
                  <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
                </span>
              )}

              {status === 'submitting' && (
                <span className="absolute inset-0 rounded-full bg-white/10 blur-sm" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
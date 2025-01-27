// This is the main landing page
'use client'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  useEffect(() => {
    if (isSignedIn) {
      redirect('/dashboard')
    }
  }, [isSignedIn])

  return (
    <div className="min-h-screen">
      <SignedOut>
        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white">        
          <div className="container mx-auto px-6 py-24">
            <h1 className="text-5xl font-bold mb-6">
              Your Restaurant Website Made Simple
            </h1>
            <p className="text-xl mb-8">
              Powerful features designed specifically for restaurants - including Chefs Feed, Community Feed, and more.
            </p>
            <Link 
              href="/admin/sign-up" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-100"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Unique Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <FeatureCard 
                title="Chefs Feed"
                description="Share special dishes and updates directly from your kitchen team."
              />
              <FeatureCard 
                title="Community Feed"
                description="Engage with your customers and build a loyal community."
              />
              <FeatureCard 
                title="Easy Management"
                description="Update your menu, photos, and content with just a few clicks."
              />
            </div>
          </div>
        </section>
    </SignedOut>
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
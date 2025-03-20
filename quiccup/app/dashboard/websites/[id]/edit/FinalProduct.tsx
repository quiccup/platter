'use client'

import { ThemeProvider } from '@/providers/theme-provider'
import { DockBar } from "./components/ui/DockBar";
import { ChefsFeedDisplay } from "./Sections/ChefsFeed/ChefsFeedDisplay";
import { GallerySection } from "./Sections/Gallery/GalleryDisplay";
import { HeroDisplay } from "./Sections/Hero/HeroDisplay";
import { MenuDisplay } from "./Sections/Menu/MenuDisplay";
import { ReviewsSection } from "./Sections/Reviews/ReviewsDisplay";
import { PlayDisplay } from "./Sections/Play/PlayDisplay";
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MenuItem } from './Sections/Menu/types';
import { ChefPost } from './types';
import { LeaderboardDisplay } from './Sections/Leaderboard/LeaderboardDisplay'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { NavBar } from './components/NavBar'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

interface FinalProductProps {
  data: {
    hero: { 
      heading: string
      subheading: string
      buttons: any[]
      logo?: string
      coverImage?: string
    }
    menu: { 
      items: MenuItem[] 
    }
    chefs: { 
      posts: ChefPost[] 
    }
    about: { 
      content: string 
    }
    contact: { 
      email: string
      phone: string 
    }
    gallery: { 
      images: string[] 
    }
    reviews: any[]
    leaderboard: any
    theme?: 'dark' | 'light'
  }
}

function ensureGalleryData(gallery: any): { images: string[], captions: Record<string, string> } {
  return {
    images: gallery.images || [],
    captions: gallery.captions || {}
  };
}

export function FinalProduct({ data }: FinalProductProps) {
  const { theme, setTheme } = usePreviewTheme()
  const params = useParams()
  
  // Update the theme from data when it changes
  useEffect(() => {
    if (data.theme && data.theme !== theme) {
      setTheme(data.theme as 'dark' | 'light')
    }
  }, [data.theme, setTheme, theme])
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200 relative`}>
      <NavBar 
        logo={data.hero?.logo} 
        companyName={data.hero?.heading || 'Restaurant Name'} 
      />
      
      {/* Chef Stories - Moved to the top */}
      <section className="mb-8">
        <ChefsFeedDisplay posts={data.chefs?.posts} />
      </section>
      
      <main>
        <div className="py-0 space-y-3">

        <section>
            <MenuDisplay 
              data={data.menu}
              websiteId={params.id}
            />
          </section>
          
          {/* Leaderboard section */}
          {data.leaderboard && (
            <section className="mb-12">
              <LeaderboardDisplay 
                data={data.leaderboard} 
                menuItems={data.menu?.items || []} 
              />
            </section>
          )}
        
          
          <section>
            <GallerySection data={ensureGalleryData(data.gallery)} />
          </section>
          
          <section>
            <PlayDisplay />
          </section>
          
          <section className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-center">
              {data.about.content || 'Add your restaurant\'s story'}
            </p>
          </section>
          
          <section className="max-w-5xl mx-auto bg-muted py-16 rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
            <div className="max-w-md mx-auto text-center">
              <p className="mb-2">
                <span className="font-semibold">Email:</span>{' '}
                {data.contact.email || 'Add your email'}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{' '}
                {data.contact.phone || 'Add your phone number'}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 
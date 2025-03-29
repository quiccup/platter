'use client'
import { ChefsFeedDisplay } from "./Sections/ChefsFeed/ChefsFeedDisplay";
import { GallerySection } from "./Sections/Gallery/GalleryDisplay";
import { MenuDisplay } from "./Sections/Menu/MenuDisplay";
import { ReviewsSection } from "./Sections/Reviews/ReviewsDisplay";
import { PlayDisplay } from "./Sections/Play/PlayDisplay";
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MenuItem } from './Sections/Menu/types';
import { ChefPost } from './types';
import { LeaderboardDisplay } from './Sections/Leaderboard/LeaderboardDisplay'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AboutDisplay } from './Sections/About/AboutDisplay';
import { SectionContainer } from './components/SectionContainer';
import { NavbarDisplay } from "./Sections/Navbar/NavbarDisplay";
import { SectionWrapper } from './components/SectionWrapper';

interface FinalProductProps {
  data: {
    hero: { 
      heading: string
      subheading: string
      buttons: any[]
      logo?: string
      coverImage?: string
      address?: string
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
    images: gallery?.images || [],
    captions: gallery?.captions || {}
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
  
  // Temporary test to ensure data is provided correctly
  console.log('FinalProduct - About data:', data.about);
  
  return (
    <div className={`w-full min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'} transition-colors duration-200`}>
      <NavbarDisplay
        logo={data.hero?.logo} 
        companyName={data.hero?.heading || 'Restaurant Name'} 
        address={data.hero?.address}
      />
      
      <main className="w-full">
        {/* Chef Stories - Dark background */}
        {data.chefs?.posts && data.chefs.posts.length > 0 && (
          <ChefsFeedDisplay posts={data.chefs.posts} />
        )}
        
        {/* Menu Display - Already handled in component */}
        <MenuDisplay 
          data={data.menu}
          websiteId={params.id as string}
        />
        
        {/* Leaderboard - Rounded container */}
        {data.leaderboard && (
          <SectionWrapper darkBackground>
            <LeaderboardDisplay 
              data={data.leaderboard} 
              menuItems={data.menu?.items || []} 
            />
          </SectionWrapper>
        )}
        
        {/* Gallery - Dark background */}
        <SectionWrapper darkBackground fullWidth>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-white">Gallery</h2>
            <GallerySection data={ensureGalleryData(data.gallery)} />
          </div>
        </SectionWrapper>
        
        {/* Play Display - Rounded container */}
        <SectionWrapper>
          <PlayDisplay />
        </SectionWrapper>
        
    
        <SectionWrapper darkBackground >
          <AboutDisplay data={data.about} />
        </SectionWrapper>
        
        {/* Contact - Rounded container */}
        <SectionWrapper>
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
            <p className="mb-2">
              <span className="font-semibold">Email:</span>{' '}
              {data.contact?.email || 'Add your email'}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{' '}
              {data.contact?.phone || 'Add your phone number'}
            </p>
          </div>
        </SectionWrapper>
      </main>
    </div>
  )
} 
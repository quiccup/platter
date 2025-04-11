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
    navbar: { 
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
  sectionOrder: string[]
}

function ensureGalleryData(gallery: any): { images: string[], captions: Record<string, string> } {
  return {
    images: gallery?.images || [],
    captions: gallery?.captions || {}
  };
}

export function FinalProduct({ data, sectionOrder = [] }: FinalProductProps) {
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
  
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'navbar':
        return (
          <NavbarDisplay
            logo={data.navbar?.logo} 
            companyName={data.navbar?.heading || 'Restaurant Name'} 
            address={data.navbar?.address}
          />
        )
      case 'menu':
        return (
          <MenuDisplay 
            data={data.menu}
            websiteId={params.id as string}
          />
        )
      case 'chefs':
        return data.chefs?.posts && data.chefs.posts.length > 0 ? (
          <ChefsFeedDisplay posts={data.chefs.posts} />
        ) : null
      case 'leaderboard':
        return data.leaderboard ? (
          <SectionWrapper darkBackground>
            <LeaderboardDisplay 
              data={data.leaderboard} 
              menuItems={data.menu?.items || []} 
            />
          </SectionWrapper>
        ) : null
      case 'gallery':
        return (
          <SectionWrapper darkBackground fullWidth>
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-white">Gallery</h2>
              <GallerySection data={ensureGalleryData(data.gallery)} />
            </div>
          </SectionWrapper>
        )
      // case 'about':
      //   return (
      //     <SectionWrapper darkBackground>
      //       <AboutDisplay data={data.about} />
      //     </SectionWrapper>
      //   )
      case 'contact':
        return (
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
        )
      default:
        return null
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        .final-product-container * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      
      <div className={`
        final-product-container
        w-full min-h-screen 
        ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'} 
        transition-colors duration-200
      `}>
        <main className="w-full">
          {Array.isArray(sectionOrder) && sectionOrder.map((sectionId) => (
            <div key={sectionId}>
              {renderSection(sectionId)}
            </div>
          ))}
        </main>
      </div>
    </>
  )
} 
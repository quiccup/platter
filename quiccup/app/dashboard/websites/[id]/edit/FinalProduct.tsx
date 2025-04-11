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
import { Instagram, Mail, Phone, Heart } from 'lucide-react'

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
      content?: string
      title?: string
      mainImage?: string
      testimonial?: {
        quote?: string
        author?: string
        authorImage?: string
      }
      socials?: {
        instagram?: string
        youtube?: string
      }
      sections?: {
        boldText?: string
        paragraph1?: string
        paragraph2?: string
        sectionImage?: string
      }
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
    social?: {
      instagram?: string
    }
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
            address={data.navbar?.address || ''}
            aboutData={data.about}
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
          <ChefsFeedDisplay posts={data.chefs.posts} logo={data.navbar?.logo} companyName={data.navbar?.heading} />
        ) : null
      case 'leaderboard':
        return data.leaderboard ? (
          <SectionWrapper>
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
              <GallerySection data={ensureGalleryData(data.gallery)} />
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
        <SectionWrapper>
          <footer className="py-12">
            <div className="max-w-4xl mx-auto">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Contact Links */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-6">Contact</h3>
                  <a 
                    href={`mailto:${data.contact?.email}`} 
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{data.contact?.email || 'Add your email'}</span>
                  </a>
                  <a 
                    href={`tel:${data.contact?.phone}`}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{data.contact?.phone || 'Add your phone number'}</span>
                  </a>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-6">Follow Us</h3>
                  <a 
                    href={data.social?.instagram || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Instagram</span>
                  </a>
                </div>

                {/* Hours or Additional Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-6">Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monday - Friday<br />
                    9:00 AM - 10:00 PM
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Saturday - Sunday<br />
                    10:00 AM - 11:00 PM
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                {/* Platter.ai Attribution */}
                <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
                  <span>Made with</span>
                  <Heart className="w-4 h-4" />
                  <span>by</span>
                  <a 
                    href="https://platter.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  >
                    platter.ai
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </SectionWrapper>
      </div>
    </>
  )
} 
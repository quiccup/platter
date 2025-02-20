'use client'

import { DockBar } from "./components/ui/DockBar";
import { ChefsFeedDisplay } from "./Sections/ChefsFeed/ChefsFeedDisplay";
import { GallerySection } from "./Sections/Gallery/GalleryDisplay";
import { HeroDisplay } from "./Sections/Hero/HeroDisplay";
import { MenuDisplay } from "./Sections/Menu/MenuDisplay";
import { ReviewsSection } from "./Sections/Reviews/ReviewsDisplay";
import { PlayDisplay } from "./Sections/Play/PlayDisplay";

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
  }
}

export function FinalProduct({ data }: FinalProductProps) {
  return (
    <div className="min-h-screen bg-black">
      <DockBar />
      
      <div className="py-16 space-y-16">
        <section>
          <HeroDisplay data={data.hero} />
        </section>

        <section>
          <MenuDisplay data={data.menu} />
        </section>

        <section>
          <GallerySection data={data.gallery} />
        </section>

        <section>
          <ChefsFeedDisplay data={data.chefs} />
        </section>

        <section>
          <PlayDisplay />
        </section>

        <section className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center">
            {data.about.content || 'Add your restaurant\'s story'}
          </p>
        </section>

        <section className="container mx-auto max-w-5xl bg-gray-50 py-16 rounded-2xl">
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
    </div>
  )
} 
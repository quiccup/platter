'use client'

import { DockBar } from "./components/ui/DockBar";
import { ChefsFeedDisplay } from "./Sections/ChefsFeed/ChefsFeedDisplay";
import { GallerySection } from "./Sections/Gallery/GalleryDisplay";
import { Hero } from "./Sections/Hero/HeroDisplay";
import { ReviewsSection } from "./Sections/Reviews/ReviewsDisplay";

interface FinalProductProps {
  data: {
    hero: { heading: string; subheading: string, buttons: any[] }
    menu: any[]
    chefs: any[]
    about: { content: string }
    contact: { email: string; phone: string }
    gallery: any[]
    reviews: any[]
  }
}

export function FinalProduct({ data }: FinalProductProps) {
  return (
    <div className="">
      <DockBar />
             <section>
    <Hero data={data.hero} />
    </section>
         <section>
    <GallerySection data={data.gallery} />
    </section>
    <ReviewsSection />
      {/* Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.menu.length > 0 ? (
              data.menu.map((item, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-orange-600 mt-2">${item.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center">Add menu items to see them here</p>
            )}
          </div>
        </div>
      </section>

      {/* Chefs Section */}
      
     <ChefsFeedDisplay/>
   

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center">
            {data.about.content || 'Add your restaurant\'s story'}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
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
        </div>
      </section>
    </div>
  )
} 
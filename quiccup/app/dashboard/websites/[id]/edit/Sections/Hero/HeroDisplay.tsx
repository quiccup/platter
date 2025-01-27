'use client'

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

interface Button {
  label: string
  url: string
  openInNewTab: boolean
}

interface HeroProps {
  data: {
    heading: string
    subheading: string
    buttons: Button[]
    logo?: string
  }
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="relative">
      <div className="bg-white relative">
        <div className="container mx-auto px-6 pt-20 pb-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            {data.logo && (
              <img 
                src={data.logo} 
                alt="Restaurant Logo"
                className="w-16 h-16 object-cover rounded-full border-2 border-gray-100"
              />
            )}
              <h3 className="font-semibold text-xl">
                {data.subheading || 'Add a description of your restaurant'}
              </h3>
           
          </div>

          <h1 className="text-6xl font-bold tracking-tight mb-10">
              {data.heading || 'Your Restaurant Name'}
            </h1>
          
       
          
          <div className="flex gap-4 justify-center">
            {data.buttons?.map((button, index) => (
              <a
                key={index}
                href={button.url}
                target={button.openInNewTab ? '_blank' : '_self'}
                rel={button.openInNewTab ? 'noopener noreferrer' : ''}
              >
                <InteractiveHoverButton>
                  {button.label}
                </InteractiveHoverButton>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
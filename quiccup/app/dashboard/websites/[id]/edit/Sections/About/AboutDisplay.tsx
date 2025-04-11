'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface AboutDisplayProps {
  data?: {
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
  }
}

export function AboutDisplay({ data = {} }: AboutDisplayProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Content */}
          <div className="col-span-7">
            {/* Title with blue background */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-16"
            >
              <div className="absolute -inset-4 bg-blue-100 -z-10" />
              <h1 className="text-[5vw] leading-[1.1] font-bold tracking-tight">
                {data?.title || 'I REALLY\nLOVE TO\nTALK WITH\nPEOPLE'}
              </h1>
            </motion.div>

            {/* Main content and testimonial */}
            <div className="grid grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed">
                  {data?.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua.'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <blockquote className="text-lg font-medium mb-4">
                  {data?.testimonial?.quote || '"Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."'}
                </blockquote>
                
                <div className="flex items-center gap-3">
                  {data?.testimonial?.authorImage && (
                    <img 
                      src={data.testimonial.authorImage} 
                      alt={data.testimonial.author || 'Testimonial author'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium">
                    {data?.testimonial?.author || 'Cynthia Summer'}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-gray-200 pt-8"
            >
              <h3 className="text-sm font-medium mb-6">Follow Us</h3>
              <div className="space-y-4">
                {data?.socials?.instagram && (
                  <a href={data.socials.instagram} className="flex items-center group">
                    <span className="text-lg">Instagram</span>
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                )}
                {data?.socials?.youtube && (
                  <a href={data.socials.youtube} className="flex items-center group">
                    <span className="text-lg">Youtube</span>
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-5 sticky top-20"
          >
            {data?.mainImage ? (
              <img 
                src={data.mainImage} 
                alt="About Us"
                className="w-full aspect-[3/4] object-cover rounded-lg"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg" />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

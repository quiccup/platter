"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChefPost {
  id: string;
  name: string;
  content: string;
  images: string[];
  tags: string[];
  timestamp: string;
}

interface ChefsFeedDisplayProps {
  data: {
    posts: ChefPost[]
  }
}

export function ChefsFeedDisplay({ data }: ChefsFeedDisplayProps) {
  return (
    <section className="w-screen bg-white py-16 md:py-24">
      <div className="max-w-[100vw] overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Chef's Feed
          </h2>
        </div>

        {/* Cards Container */}
        <div className="relative px-4 md:px-8 lg:px-12">
          {/* Scrollable cards */}
          <div className="flex overflow-x-auto snap-x snap-mandatory 
            gap-4 md:gap-6 pb-4
            scrollbar-hide md:scrollbar-default md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100
            max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-6rem)] mx-auto"
          >
            {data.posts?.map((post) => (
              <div 
                key={post.id} 
                className="flex-none w-[85vw] min-w-[300px] max-w-[450px] sm:w-[400px] md:w-[450px] 
                  bg-white rounded-2xl overflow-hidden shadow-md snap-center first:ml-0"
              >
                <div className="p-6 space-y-6">
                  {/* Chef info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2">
                      <AvatarImage src="/chef1.jpg" />
                      <AvatarFallback>{post.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {post.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Post content */}
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                    "{post.content}"
                  </p>

                  {/* Image */}
                  {post.images?.[0] && (
                    <div className="rounded-xl overflow-hidden">
                      <img 
                        src={post.images[0]} 
                        alt={post.content}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

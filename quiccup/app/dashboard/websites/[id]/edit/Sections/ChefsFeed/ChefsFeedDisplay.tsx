"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart } from "lucide-react";

interface ChefPost {
  id: string;
  name: string;
  content: string;
  images: string[];
  tags: string[];
  timestamp: string;
  views?: number;
  likes?: number;
}

interface ChefsFeedDisplayProps {
  data: {
    posts: ChefPost[]
  }
}

export function ChefsFeedDisplay({ data }: ChefsFeedDisplayProps) {
  return (
    <section className="relative">
      <div className="container mx-auto px-4">
        {/* Cards Container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 
            bg-gradient-to-r from-background to-transparent z-10" />
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 
            bg-gradient-to-l from-background to-transparent z-10" />

          {/* Scrollable cards */}
          <div className="flex overflow-x-auto gap-4 pb-4
            scrollbar-hide md:scrollbar-default md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100"
          >
            {data.posts?.map((post) => (
              <div 
                key={post.id} 
                className="flex-none w-[85vw] sm:w-[400px] md:w-[450px] 
                  bg-card rounded-2xl overflow-hidden shadow-md first:ml-0"
              >
                <div className="p-4">
                  {/* Header with Avatar and Name */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2">
                        <AvatarImage src="/chef1.jpg" />
                        <AvatarFallback>{post.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-lg">
                            {post.name}
                          </p>
                          <span className="text-teal-500">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          </span>
                        </div>
                        <p className="text-muted-foreground">Posted {post.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-foreground text-lg mb-4">
                    {post.content}
                  </p>

                  {/* Image */}
                  {post.images?.[0] && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img 
                        src={post.images[0]} 
                        alt={post.content}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="text-teal-500 text-base hover:underline cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="w-5 h-5" />
                      <span>{post.views || 5874}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="w-5 h-5" />
                      <span>{post.likes || 215}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

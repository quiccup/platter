"use client";


import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChefPost {
  id: string;
  name: string;
  image: string;
  content: string;
  timestamp: string;
}

export function ChefsFeedDisplay() {
  const [posts, setPosts] = useState<ChefPost[]>([
    {
      id: "1",
      name: "Chef John",
      image: "/chef1.jpg",
      content: "Just finished creating a new seasonal menu! Can't wait for you all to try it 🍽️",
      timestamp: "2h ago"
    },
    // Add more sample posts
  ]);
  
  const [newPost, setNewPost] = useState("");
  const constraintsRef = useRef(null);

  return (
    <div className="w-full max-w-3xl mx-auto p-4" ref={constraintsRef}>
      {/* Post Input */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/chef1.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="What's cooking?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-2"
              />
              <Button 
                onClick={() => {
                  if (newPost.trim()) {
                    setPosts([{
                      id: Date.now().toString(),
                      name: "Chef John",
                      image: "/chef1.jpg",
                      content: newPost,
                      timestamp: "Just now"
                    }, ...posts]);
                    setNewPost("");
                  }
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            drag="x"
            dragConstraints={constraintsRef}
            whileTap={{ scale: 0.95 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={post.image} />
                  <AvatarFallback>{post.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{post.name}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChefPost } from '../../types';

interface ChefsFeedEditProps {
  websiteId: string;
  data: {
    posts: ChefPost[];
    restaurantName?: string;
  };
  onChange: (newData: any) => void;
}

export function ChefsFeedEdit({ websiteId, data, onChange }: ChefsFeedEditProps) {
  const [isManagePostsOpen, setIsManagePostsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ChefPost | null>(null);
  const [posts, setPosts] = useState<ChefPost[]>(data.posts || []);

  const defaultAuthor = `${data.restaurantName || 'Restaurant'} Team`;

  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsCreatePostOpen(true);
  };

  const handleEditPost = (post: ChefPost) => {
    setSelectedPost(post);
    setIsCreatePostOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    const newPosts = posts.filter(post => post.id !== postId);
    setPosts(newPosts);
    onChange({ ...data, posts: newPosts });
  };

  const handleSavePost = (post: ChefPost) => {
    let newPosts;
    if (selectedPost) {
      newPosts = posts.map(p => p.id === selectedPost.id ? post : p);
    } else {
      newPosts = [...posts, { ...post, id: Date.now().toString() }];
    }
    setPosts(newPosts);
    onChange({ ...data, posts: newPosts });
    setIsCreatePostOpen(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsManagePostsOpen(true)} className="w-full">
        Manage Posts
      </Button>

      {/* Manage Posts Dialog */}
      <Dialog open={isManagePostsOpen} onOpenChange={setIsManagePostsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Posts</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Button onClick={handleCreatePost} className="w-full">
              Create New Post
            </Button>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.name}</h3>
                    <p className="text-sm text-gray-500">{post.author || defaultAuthor}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEditPost(post)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePost(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Post Dialog */}
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          </DialogHeader>
          
          <PostForm
            post={selectedPost}
            defaultAuthor={defaultAuthor}
            onSave={handleSavePost}
            onCancel={() => setIsCreatePostOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PostFormProps {
  post: ChefPost | null;
  defaultAuthor: string;
  onSave: (post: ChefPost) => void;
  onCancel: () => void;
}

function PostForm({ post, defaultAuthor, onSave, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<Partial<ChefPost>>(
    post || {
      content: '',
      author: defaultAuthor,
      images: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ChefPost);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Author</label>
        <Select
          value={formData.author}
          onValueChange={(value) => setFormData({ ...formData, author: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={defaultAuthor}>{defaultAuthor}</SelectItem>
            <SelectItem value="Chef">Chef</SelectItem>
            <SelectItem value="Kitchen Team">Kitchen Team</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {formData.author === 'Custom' && (
          <Input
            className="mt-2"
            placeholder="Enter custom author name"
            value={formData.customAuthor || ''}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="What's cooking in the kitchen?"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Images</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData({
                  ...formData,
                  images: [...(formData.images || []), reader.result as string]
                });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {formData.images && formData.images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1"
                  onClick={() => setFormData({
                    ...formData,
                    images: formData.images?.filter((_, i) => i !== idx)
                  })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {post ? 'Save Changes' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
} 
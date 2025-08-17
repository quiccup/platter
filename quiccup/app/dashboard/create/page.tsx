'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UtensilsCrossed, Globe, Palette, Type, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateWebsitePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    restaurant_name: '',
    subdomain: '',
    description: '',
    theme: 'light',
    fontFamily: 'Inter',
    cuisine_type: 'general'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSubdomain = () => {
    if (formData.restaurant_name) {
      const subdomain = formData.restaurant_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20)
      setFormData(prev => ({ ...prev, subdomain }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be logged in to create a website')
      return
    }

    if (!formData.restaurant_name || !formData.subdomain) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Create new user record
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: user.id, // Foreign key to auth.users
          restaurant_name: formData.restaurant_name,
          subdomain: formData.subdomain,
          description: formData.description,
          settings: {
            theme: formData.theme,
            fontFamily: formData.fontFamily,
            cuisine_type: formData.cuisine_type
          },
          content: {
            navbar: {
              heading: formData.restaurant_name,
              subheading: formData.description || 'Delicious food, great service',
              buttons: []
            },
            menu: { items: [] },
            chefs: { posts: [] },
            about: { 
              content: formData.description || `Welcome to ${formData.restaurant_name}! We serve amazing ${formData.cuisine_type} cuisine.`
            },
            contact: { email: '', phone: '' },
            gallery: { images: [], captions: {} },
            reviews: [],
            leaderboard: { items: [] },
            play: { games: [] }
          },
          is_published: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      toast.success('Website created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error creating website:', error)
      toast.error(error.message || 'Failed to create website')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Restaurant Website</h1>
          <p className="text-gray-600">Set up your restaurant's online presence in minutes</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                Website Setup
              </CardTitle>
              <CardDescription>
                Fill in the details below to create your restaurant website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Restaurant Name */}
                <div>
                  <Label htmlFor="restaurant_name">Restaurant Name *</Label>
                  <Input
                    id="restaurant_name"
                    value={formData.restaurant_name}
                    onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                    placeholder="e.g., Joe's Pizza Palace"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Subdomain */}
                <div>
                  <Label htmlFor="subdomain">Website URL *</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="joespizza"
                      className="rounded-r-none"
                      required
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 text-sm">
                      .platter.com
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSubdomain}
                    className="mt-2"
                  >
                    Generate from name
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    This will be your website's URL: {formData.subdomain ? `${formData.subdomain}.platter.com` : 'yourname.platter.com'}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Restaurant Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell customers about your restaurant, cuisine, and what makes you special..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Cuisine Type */}
                <div>
                  <Label htmlFor="cuisine_type">Cuisine Type</Label>
                  <Select value={formData.cuisine_type} onValueChange={(value) => handleInputChange('cuisine_type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="greek">Greek</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme */}
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (follows system)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Family */}
                <div>
                  <Label htmlFor="fontFamily">Font Style</Label>
                  <Select value={formData.fontFamily} onValueChange={(value) => handleInputChange('fontFamily', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Modern)</SelectItem>
                      <SelectItem value="Roboto">Roboto (Clean)</SelectItem>
                      <SelectItem value="Open Sans">Open Sans (Friendly)</SelectItem>
                      <SelectItem value="Lato">Lato (Professional)</SelectItem>
                      <SelectItem value="Poppins">Poppins (Elegant)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Website...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Create Website
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-500" />
                What You'll Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Professional restaurant website</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Menu management system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Gallery and reviews</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI-powered menu recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Mobile-responsive design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Easy content editing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

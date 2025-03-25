'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { uploadImage } from '@/lib/uploadImage'
import { PlusCircle, X, GripVertical, ChevronUp, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react'

interface AboutSection {
  title?: string
  content?: string
  image?: string
}

interface AboutData {
  content?: string
  title?: string
  subtitle?: string
  image?: string
  story?: AboutSection[]
}

interface AboutEditProps {
  data: AboutData
  onChange: (data: AboutData) => void
}

export function AboutEdit({ data, onChange }: AboutEditProps) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    try {
      setIsUploading(true)
      const file = e.target.files[0]
      const imageUrl = await uploadImage(file)
      onChange({ ...data, image: imageUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      // Reset the input value so the same file can be selected again
      e.target.value = ''
    }
  }
  
  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0 || !data.story) return
    
    try {
      setIsUploading(true)
      const file = e.target.files[0]
      const imageUrl = await uploadImage(file)
      
      const updatedSections = [...data.story]
      updatedSections[index] = { ...updatedSections[index], image: imageUrl }
      
      onChange({ ...data, story: updatedSections })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      // Reset the input value so the same file can be selected again
      e.target.value = ''
    }
  }
  
  const addSection = () => {
    const newSection: AboutSection = {
      title: 'New Section',
      content: 'Enter content for this section',
      image: ''
    }
    
    onChange({
      ...data,
      story: [...(data.story || []), newSection]
    })
    
    // Expand the newly added section
    setExpanded((data.story?.length || 0))
  }
  
  const removeSection = (index: number) => {
    if (!data.story) return
    
    const updatedSections = data.story.filter((_, i) => i !== index)
    onChange({ ...data, story: updatedSections })
    
    // Close expanded section if it was removed
    if (expanded === index) {
      setExpanded(null)
    } else if (expanded !== null && expanded > index) {
      setExpanded(expanded - 1)
    }
  }
  
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!data.story || 
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.story.length - 1)) {
      return
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedSections = [...data.story]
    
    // Swap positions
    const temp = updatedSections[index]
    updatedSections[index] = updatedSections[newIndex]
    updatedSections[newIndex] = temp
    
    onChange({ ...data, story: updatedSections })
    
    // Update expanded section if needed
    if (expanded === index) {
      setExpanded(newIndex)
    } else if (expanded === newIndex) {
      setExpanded(index)
    }
  }
  
  // Simple image preview component
  const ImagePreview = ({ src, className }: { src?: string, className?: string }) => {
    if (!src) return (
      <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <ImageIcon className="text-gray-400" size={24} />
      </div>
    )
    
    return (
      <div className={`relative ${className}`}>
        <img src={src} alt="Preview" className="w-full h-full object-cover" />
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Main About Section */}
      <Card>
        <CardHeader>
          <CardTitle>Main Header Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="about-title">Title</Label>
              <Input 
                id="about-title"
                value={data.title || ''} 
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                placeholder="OUR STORY"
              />
            </div>
            
            <div>
              <Label htmlFor="about-subtitle">Subtitle</Label>
              <Input 
                id="about-subtitle"
                value={data.subtitle || ''} 
                onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
                placeholder="A brief tagline or subtitle"
              />
            </div>
          </div>
          
          <div>
            <Label>Header Image (Circle)</Label>
            <div className="mt-2 flex flex-col space-y-2">
              <ImagePreview src={data.image} className="w-40 h-40 rounded-full" />
              
              <div>
                <Label htmlFor="main-image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 border rounded p-2 w-fit hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Upload size={16} />
                    <span>{data.image ? 'Change Image' : 'Upload Image'}</span>
                  </div>
                  <input 
                    id="main-image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleMainImageUpload}
                    disabled={isUploading}
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-2">
                  This image will appear in the circle with rotating rays
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="about-content">Default Content</Label>
            <Textarea 
              id="about-content"
              value={data.content || ''} 
              onChange={(e) => onChange({ ...data, content: e.target.value })}
              placeholder="Enter your main about content here"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              This content will be used if no story sections are added
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Story Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Story Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.story?.map((section, index) => (
            <Card key={index} className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="px-4 py-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-500 cursor-move">
                    <GripVertical size={18} />
                  </button>
                  <h3 className="text-base font-medium truncate">
                    {section.title || `Section ${index + 1}`}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40"
                  >
                    <ChevronUp size={18} />
                  </button>
                  
                  <button 
                    onClick={() => moveSection(index, 'down')}
                    disabled={!data.story || index === data.story.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40"
                  >
                    <ChevronDown size={18} />
                  </button>
                  
                  <button 
                    onClick={() => setExpanded(expanded === index ? null : index)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {expanded === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  <button 
                    onClick={() => removeSection(index)}
                    className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              </CardHeader>
              
              {expanded === index && (
                <CardContent className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor={`section-title-${index}`}>Section Title</Label>
                    <Input
                      id={`section-title-${index}`}
                      value={section.title || ''}
                      onChange={(e) => {
                        if (!data.story) return
                        const updatedSections = [...data.story]
                        updatedSections[index] = { ...section, title: e.target.value }
                        onChange({ ...data, story: updatedSections })
                      }}
                      placeholder="Section Title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`section-content-${index}`}>Content</Label>
                    <Textarea
                      id={`section-content-${index}`}
                      value={section.content || ''}
                      onChange={(e) => {
                        if (!data.story) return
                        const updatedSections = [...data.story]
                        updatedSections[index] = { ...section, content: e.target.value }
                        onChange({ ...data, story: updatedSections })
                      }}
                      placeholder="Section content"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Section Image</Label>
                    <div className="mt-2 space-y-2">
                      <ImagePreview 
                        src={section.image} 
                        className="w-full aspect-[4/3] rounded-md" 
                      />
                      
                      <div>
                        <Label htmlFor={`section-image-${index}`} className="cursor-pointer">
                          <div className="flex items-center gap-2 border rounded p-2 w-fit hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Upload size={16} />
                            <span>{section.image ? 'Change Image' : 'Upload Image'}</span>
                          </div>
                          <input 
                            id={`section-image-${index}`} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleSectionImageUpload(e, index)}
                            disabled={isUploading}
                          />
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
          
          <Button 
            onClick={addSection}
            variant="outline"
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Add Story Section</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { uploadImage } from '@/lib/uploadImage'
import { PlusCircle, X, Upload, Image as ImageIcon, Pencil } from 'lucide-react'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [tempData, setTempData] = useState<AboutData>(data)
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    try {
      setIsUploading(true)
      const file = e.target.files[0]
      const imageUrl = await uploadImage(file, 'about')
      setTempData({ ...tempData, image: imageUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }
  
  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || editingSectionIndex === null) return
    
    try {
      setIsUploading(true)
      const file = e.target.files[0]
      const imageUrl = await uploadImage(file, 'about')
      
      const updatedSections = [...(tempData.story || [])]
      updatedSections[editingSectionIndex] = { 
        ...updatedSections[editingSectionIndex], 
        image: imageUrl 
      }
      
      setTempData({ ...tempData, story: updatedSections })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }
  
  const addSection = () => {
    const newSection: AboutSection = {
      title: 'New Section',
      content: 'Enter content for this section',
      image: ''
    }
    
    setTempData({
      ...tempData,
      story: [...(tempData.story || []), newSection]
    })
    
    setEditingSectionIndex((tempData.story?.length || 0))
  }
  
  const removeSection = (index: number) => {
    if (!tempData.story) return
    
    const updatedSections = tempData.story.filter((_, i) => i !== index)
    setTempData({ ...tempData, story: updatedSections })
    
    if (editingSectionIndex === index) {
      setEditingSectionIndex(null)
    }
  }

  const saveChanges = () => {
    onChange(tempData)
    setIsModalOpen(false)
  }

  return (
    <div>
      {/* Preview/Summary of current content */}
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{data.title || 'About Us'}</h2>
          <Button onClick={() => {
            setTempData(data)
            setIsModalOpen(true)
          }}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit About Section
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.image && (
            <div className="aspect-square rounded-full overflow-hidden">
              <img src={data.image} alt="About" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="text-gray-600 dark:text-gray-300">{data.content}</p>
            {data.story && data.story.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {data.story.length} story sections added
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          setTempData(data)
          setEditingSectionIndex(null)
        }
        setIsModalOpen(open)
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit About Section</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Main About Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={tempData.title || ''}
                    onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={tempData.subtitle || ''}
                    onChange={(e) => setTempData({ ...tempData, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Main Content</Label>
                <Textarea
                  value={tempData.content || ''}
                  onChange={(e) => setTempData({ ...tempData, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Main Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {tempData.image ? (
                      <img src={tempData.image} alt="Main" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="main-image"
                    onChange={handleMainImageUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('main-image')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Change Image'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Story Sections */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Story Sections</h3>
                <Button onClick={addSection} variant="outline" size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>

              <div className="space-y-4">
                {tempData.story?.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">{section.title || `Section ${index + 1}`}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSectionIndex(index)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSection(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {editingSectionIndex === index ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Section Title</Label>
                          <Input
                            value={section.title || ''}
                            onChange={(e) => {
                              const updatedSections = [...(tempData.story || [])]
                              updatedSections[index] = { ...section, title: e.target.value }
                              setTempData({ ...tempData, story: updatedSections })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={section.content || ''}
                            onChange={(e) => {
                              const updatedSections = [...(tempData.story || [])]
                              updatedSections[index] = { ...section, content: e.target.value }
                              setTempData({ ...tempData, story: updatedSections })
                            }}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Image</Label>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                              {section.image ? (
                                <img src={section.image} alt="Section" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`section-image-${index}`}
                              onChange={handleSectionImageUpload}
                            />
                            <Button
                              variant="outline"
                              onClick={() => document.getElementById(`section-image-${index}`)?.click()}
                              disabled={isUploading}
                            >
                              {isUploading ? 'Uploading...' : 'Change Image'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {section.content?.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

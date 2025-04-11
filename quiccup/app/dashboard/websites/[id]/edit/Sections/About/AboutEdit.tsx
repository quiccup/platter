'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { uploadImage } from '@/lib/uploadImage'
import { ImageIcon, Pencil } from 'lucide-react'

interface AboutData {
  title?: string
  content?: string
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

interface AboutEditProps {
  data: AboutData
  onChange: (data: AboutData) => void
}

export function AboutEdit({ data, onChange }: AboutEditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempData, setTempData] = useState<AboutData>(data)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'author') => {
    if (!e.target.files || e.target.files.length === 0) return
    
    try {
      setIsUploading(true)
      const file = e.target.files[0]
      const imageUrl = await uploadImage(file, 'about')
      
      if (type === 'main') {
        setTempData({ ...tempData, mainImage: imageUrl })
      } else {
        setTempData({
          ...tempData,
          testimonial: {
            ...tempData.testimonial,
            authorImage: imageUrl
          }
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const saveChanges = () => {
    onChange(tempData)
    setIsModalOpen(false)
  }

  return (
    <div>
      {/* Preview */}
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">About Section</h2>
            <p className="text-sm text-gray-500">Edit your story and testimonial</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Content
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Edit About Section</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 pb-6">
            <div className="space-y-8">
              {/* Title Section */}
              <div>
                <Label className="text-base">Title</Label>
                <Textarea
                  value={tempData.title || ''}
                  onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                  placeholder="I REALLY LOVE TO TALK WITH PEOPLE"
                  className="font-bold mt-2"
                  rows={4}
                />
              </div>

              {/* Main Content Section */}
              <div>
                <Label className="text-base">Main Content</Label>
                <Textarea
                  value={tempData.content || ''}
                  onChange={(e) => setTempData({ ...tempData, content: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Main Image Section */}
              <div>
                <Label className="text-base">Main Image</Label>
                <div className="mt-3 flex items-start gap-4">
                  <div className="w-40 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {tempData.mainImage ? (
                      <img src={tempData.mainImage} alt="Main" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="main-image"
                      onChange={(e) => handleImageUpload(e, 'main')}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('main-image')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Change Image'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended size: 800x1200px
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Section */}
              <div>
                <h3 className="text-base font-medium mb-4">Testimonial</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={tempData.testimonial?.quote || ''}
                      onChange={(e) => setTempData({
                        ...tempData,
                        testimonial: { ...tempData.testimonial, quote: e.target.value }
                      })}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Author Name</Label>
                      <Input
                        value={tempData.testimonial?.author || ''}
                        onChange={(e) => setTempData({
                          ...tempData,
                          testimonial: { ...tempData.testimonial, author: e.target.value }
                        })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Author Image</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {tempData.testimonial?.authorImage ? (
                            <img src={tempData.testimonial.authorImage} alt="Author" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="author-image"
                          onChange={(e) => handleImageUpload(e, 'author')}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('author-image')?.click()}
                          disabled={isUploading}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div>
                <h3 className="text-base font-medium mb-4">Social Links</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Instagram URL</Label>
                    <Input
                      value={tempData.socials?.instagram || ''}
                      onChange={(e) => setTempData({
                        ...tempData,
                        socials: { ...tempData.socials, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/..."
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Youtube URL</Label>
                    <Input
                      value={tempData.socials?.youtube || ''}
                      onChange={(e) => setTempData({
                        ...tempData,
                        socials: { ...tempData.socials, youtube: e.target.value }
                      })}
                      placeholder="https://youtube.com/..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed at bottom */}
          <div className="border-t p-4 flex justify-end gap-2 bg-background">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveChanges}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

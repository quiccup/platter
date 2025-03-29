'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/uploadImage"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Pencil } from "lucide-react"
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface NavbarData {
  heading: string
  logo?: string
  coverImages?: string[]
  address?: string
}

interface NavbarEditProps {
  data: NavbarData
  onChange: (data: NavbarData) => void
}

export function NavbarEdit({ data, onChange }: NavbarEditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempData, setTempData] = useState<NavbarData>(data)
  const [isUploading, setIsUploading] = useState(false)
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  })

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const url = await uploadImage(file, 'logo')
      setTempData({ ...tempData, logo: url })
    } catch (error) {
      console.error('Error uploading logo:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const url = await uploadImage(file, 'hero')
      setTempData({ 
        ...tempData, 
        coverImages: [...(tempData.coverImages || []), url].slice(0, 3) 
      })
    } catch (error) {
      console.error('Error uploading cover image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const saveChanges = () => {
    onChange(tempData)
    setIsModalOpen(false)
  }

  return (
    <div>
      {/* Preview/Summary */}
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {data.logo && (
              <img src={data.logo} alt="Logo" className="w-12 h-12 rounded-full object-contain" />
            )}
            <div>
              <h2 className="text-xl font-semibold">{data.heading}</h2>
              {data.address && (
                <p className="text-sm text-gray-500">{data.address}</p>
              )}
            </div>
          </div>
          <Button onClick={() => {
            setTempData(data)
            setIsModalOpen(true)
          }}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Navbar
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) setTempData(data)
        setIsModalOpen(open)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Navbar</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {tempData.logo && (
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img 
                      src={tempData.logo} 
                      alt="Logo preview" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleLogoUpload(file)
                    }}
                    disabled={isUploading}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading Logo...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Cover Images */}
            <div className="space-y-4">
              <Label>Cover Images</Label>
              <div className="grid grid-cols-3 gap-4">
                {tempData.coverImages?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Cover ${index + 1}`}
                      className="w-full aspect-video rounded-lg object-cover"
                    />
                    <button
                      onClick={() => {
                        setTempData({
                          ...tempData,
                          coverImages: tempData.coverImages?.filter((_, i) => i !== index) || []
                        })
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(!tempData.coverImages || tempData.coverImages.length < 3) && (
                  <Button
                    variant="outline"
                    className="h-32 w-full"
                    onClick={() => document.getElementById('cover-image-upload')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="cover-image-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleCoverImageUpload(file)
                }}
              />
            </div>

            {/* Text Inputs */}
            <div className="space-y-4">
              <div>
                <Label>Heading</Label>
                <Input
                  value={tempData.heading || ''}
                  onChange={(e) => setTempData({ ...tempData, heading: e.target.value })}
                  placeholder="Enter heading"
                />
              </div>

              {/* Address Input */}
              <div>
                <Label>Restaurant Address</Label>
                {isLoaded ? (
                  <div className="relative">
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocomplete.setTypes(['establishment', 'address'])
                      }}
                      onPlaceChanged={() => {
                        const place = (
                          document.getElementById('address-input') as HTMLInputElement
                        ).value
                        setTempData({ ...tempData, address: place })
                      }}
                    >
                      <Input
                        id="address-input"
                        type="text"
                        value={tempData.address || ''}
                        onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                        placeholder="Search for your restaurant address..."
                      />
                    </Autocomplete>
                    {tempData.address && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2"
                        onClick={() => setTempData({ ...tempData, address: '' })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Google Maps...
                  </div>
                )}
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
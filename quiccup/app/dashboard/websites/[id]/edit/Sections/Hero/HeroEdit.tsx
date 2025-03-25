'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadImage } from "@/lib/uploadImage"
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface HeroData {
  heading: string
  subheading: string
  buttons: Array<{ label: string; url: string; openInNewTab: boolean }>
  logo?: string
  coverImages?: string[]
}

interface HeroEditProps {
  data: HeroData
  onChange: (data: HeroData) => void
}

export function HeroEdit({ data, onChange }: HeroEditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  // Initialize data with empty buttons array if it doesn't exist
  React.useEffect(() => {
    if (!data.buttons) {
      onChange({ ...data, buttons: [] });
    }
  }, []);

  const handleCoverImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const url = await uploadImage(file, 'hero')
      onChange({ ...data, coverImages: [...(data.coverImages || []), url].slice(0, 3) })
    } catch (error) {
      console.error('Error uploading cover image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploadingLogo(true)
      const url = await uploadImage(file, 'logo')
      onChange({ ...data, logo: url })
    } catch (error) {
      console.error('Error uploading logo:', error)
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleAddButton = () => {
    if (data.buttons.length >= 2) return // Max 2 buttons
    
    onChange({
      ...data,
      buttons: [
        ...data.buttons,
        { label: 'New Button', url: '#', openInNewTab: false }
      ]
    })
  }

  const handleDeleteButton = (index: number) => {
    onChange({
      ...data,
      buttons: data.buttons.filter((_, i) => i !== index)
    })
  }

  const handleButtonChange = (index: number, field: keyof typeof data.buttons[0], value: string | boolean) => {
    onChange({
      ...data,
      buttons: data.buttons.map((button, i) => 
        i === index ? { ...button, [field]: value } : button
      )
    })
  }

  const removeImage = (indexToRemove: number) => {
    onChange({
      ...data,
      coverImages: data?.coverImages?.filter((_, i) => i !== indexToRemove) || []
    })
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="space-y-4">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          {data?.logo && (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <img 
                src={data.logo} 
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
              disabled={isUploadingLogo}
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={isUploadingLogo}
            >
              {isUploadingLogo ? (
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

      {/* Cover Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Cover Images</Label>
          {(data.coverImages?.length || 0) < 3 && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Image
                </>
              )}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {data.coverImages?.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Cover ${index + 1}`}
                className="w-full aspect-video rounded-lg object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full 
                  text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleCoverImageUpload(file)
        }}
      />

      {/* Text Inputs */}
      <div className="space-y-4">
        <div>
          <Label>Heading</Label>
          <Input
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Enter heading"
          />
        </div>

        <div>
          <Label>Subheading</Label>
          <Input
            value={data.subheading || ''}
            onChange={(e) => onChange({ ...data, subheading: e.target.value })}
            placeholder="Enter subheading"
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Buttons</h3>
          {data.buttons.length < 2 && (
            <Button 
              onClick={handleAddButton}
              size="sm"
              variant="outline"
            >
              Add Button
            </Button>
          )}
        </div>

        {data.buttons.map((button, index) => (
          <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Button {index + 1}</h4>
              <Button
                onClick={() => handleDeleteButton(index)}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>

            <Input
              value={button.label}
              onChange={(e) => handleButtonChange(index, 'label', e.target.value)}
              placeholder="Button Label"
            />

            <Input
              value={button.url}
              onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
              placeholder="Button URL"
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id={`openInNewTab-${index}`}
                checked={button.openInNewTab}
                onCheckedChange={(checked) => 
                  handleButtonChange(index, 'openInNewTab', checked as boolean)
                }
              />
              <label htmlFor={`openInNewTab-${index}`}>
                Open in new tab
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
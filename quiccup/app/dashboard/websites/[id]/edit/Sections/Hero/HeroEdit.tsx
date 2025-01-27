'use client'

import { Input } from "@/components/ui/input"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { uploadImage } from "@/lib/uploadImage"

interface Button {
  label: string
  url: string
  openInNewTab: boolean
}

interface HeroEditProps {
  data: {
    heading: string
    subheading: string
    buttons: Button[]
    logo?: string
  }
  onChange: (data: any) => void
}

export function HeroEdit({ data, onChange }: HeroEditProps) {
  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, 'logos')
      onChange({ ...data, logo: url })
    } catch (error) {
      console.error('Error uploading logo:', error)
    }
  }

  return (
    <section className="relative">
      <div className="bg-white relative">
        <div className="container mx-auto px-6 pt-20 pb-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
   
              {data.logo ? (
                <img 
                  src={data.logo} 
                  alt="Restaurant Logo"
                  className="w-16 h-16 object-cover rounded-full border-2 border-gray-100 hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
         
         <h3 className="font-semibold text-xl">
            <input
              value={data.subheading}
              onChange={(e) => onChange({ ...data, subheading: e.target.value })}
              placeholder="Add a description of your restaurant"
              className="font-semibold text-xl bg-transparent border-none text-center focus:ring-0 hover:bg-gray-50"
            />
            </h3>
          </div>

          <Input
            value={data.heading}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Your Restaurant Name"
            className="text-6xl font-bold tracking-tight mb-10 bg-transparent border-none text-center focus:ring-0 hover:bg-gray-50"
          />
          
          <div className="flex gap-4 justify-center">
            {data.buttons?.map((button, index) => (
              <div key={index} className="relative group">
                <Input
                  value={button.label}
                  onChange={(e) => {
                    const newButtons = [...data.buttons]
                    newButtons[index] = { ...button, label: e.target.value }
                    onChange({ ...data, buttons: newButtons })
                  }}
                  className="px-4 py-2 bg-transparent border-none focus:ring-0 hover:bg-gray-50"
                />
                <Input
                  value={button.url}
                  onChange={(e) => {
                    const newButtons = [...data.buttons]
                    newButtons[index] = { ...button, url: e.target.value }
                    onChange({ ...data, buttons: newButtons })
                  }}
                  placeholder="Button URL"
                  className="absolute -bottom-8 left-0 w-full text-sm bg-white border rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
            {data.buttons?.length < 3 && (
              <button
                onClick={() => onChange({
                  ...data,
                  buttons: [...data.buttons, { label: 'New Button', url: '', openInNewTab: true }]
                })}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                Add Button
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
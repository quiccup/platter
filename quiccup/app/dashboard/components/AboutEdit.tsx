'use client'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AboutData {
  content: string
}

interface AboutEditProps {
  data: AboutData
  onChange: (data: AboutData) => void
}

export function AboutEdit({ data, onChange }: AboutEditProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">About Us Editor</h3>
        <p className="text-sm text-gray-600 mb-6">
          Tell your customers about your restaurant's story and mission
        </p>
      </div>

      <div>
        <Label htmlFor="about-content">About Content</Label>
        <Textarea
          id="about-content"
          value={data?.content || ''}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Share your restaurant's story, mission, and what makes you unique..."
          rows={8}
        />
      </div>
    </div>
  )
}

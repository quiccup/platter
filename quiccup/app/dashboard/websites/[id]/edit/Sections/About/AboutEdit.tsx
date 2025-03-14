'use client'

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AboutEditProps {
  data: {
    content: string
  }
  onChange: (data: { content: string }) => void
}

export function AboutEdit({ data, onChange }: AboutEditProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Restaurant Story</Label>
        <Textarea
          placeholder="Tell your restaurant's story..."
          value={data.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="min-h-[200px]"
        />
      </div>
    </div>
  )
}

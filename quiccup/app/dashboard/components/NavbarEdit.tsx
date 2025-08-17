'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NavbarData {
  heading: string
  subheading: string
  buttons: Array<{
    text: string
    url: string
    variant: 'primary' | 'secondary'
  }>
}

interface NavbarEditProps {
  data: NavbarData
  onChange: (data: NavbarData) => void
}

export function NavbarEdit({ data, onChange }: NavbarEditProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Navbar Editor</h3>
        <p className="text-sm text-gray-600 mb-6">
          Customize your website's header and navigation
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="heading">Restaurant Name</Label>
          <Input
            id="heading"
            value={data?.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Your Restaurant Name"
          />
        </div>

        <div>
          <Label htmlFor="subheading">Tagline</Label>
          <Textarea
            id="subheading"
            value={data?.subheading || ''}
            onChange={(e) => onChange({ ...data, subheading: e.target.value })}
            placeholder="A brief description or tagline for your restaurant"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}

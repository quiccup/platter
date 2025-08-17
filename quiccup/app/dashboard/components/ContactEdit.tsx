'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactData {
  email: string
  phone: string
}

interface ContactEditProps {
  data: ContactData
  onChange: (data: ContactData) => void
}

export function ContactEdit({ data, onChange }: ContactEditProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information Editor</h3>
        <p className="text-sm text-gray-600 mb-6">
          Update your restaurant's contact details
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={data?.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="contact@yourrestaurant.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={data?.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
    </div>
  )
}

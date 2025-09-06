'use client'
import Link from 'next/link'
import { User, CreditCard, Building } from 'lucide-react'

export default function SettingsPage() {
  const settingsCards = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      href: `/dashboard/settings/profile`,
      description: 'Manage profile settings'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: CreditCard, 
      href: `/dashboard/settings/billing`,
      description: 'Manage billing settings'
    },
    { 
      id: 'collaborators', 
      label: 'Collaborators', 
      icon: Building, 
      href: `/dashboard/settings/collaborators`,
      description: 'Manage collaborators settings'
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Settings Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              href={card.href}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">{card.label}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
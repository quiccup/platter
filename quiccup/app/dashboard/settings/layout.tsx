'use client'
import Link from 'next/link'
import { User, CreditCard, Building } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User, href: `/dashboard/settings/profile` },
    { id: 'billing', label: 'Billing', icon: CreditCard, href: `/dashboard/settings/billing` },
    { id: 'collaborators', label: 'Collaborators', icon: Building, href: `/dashboard/settings/collaborators` },
  ]

  return (
    <div className="container mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pathname === item.href 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-lg p-6 border border-gray-200">
        {children}
      </main>
    </div>
  )
}
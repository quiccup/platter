'use client'
import Link from 'next/link'
import { Globe, Lock, Building, CreditCard } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SettingsLayoutProps {
  params: {
    id: string
  }
}

export default function SettingsPage({ params }: SettingsLayoutProps) {
  const pathname = usePathname()
  
  const sidebarItems = [
    { id: 'website', label: 'Website', icon: Globe, href: `/dashboard/websites/${params.id}/settings/website` },
    { id: 'permissions', label: 'Permissions', icon: Lock, href: `/dashboard/websites/${params.id}/settings/permissions` },
    { id: 'domains', label: 'Domains', icon: Building, href: `/dashboard/websites/${params.id}/settings/domains` },
    { id: 'billing', label: 'Billing', icon: CreditCard, href: `/dashboard/websites/${params.id}/settings/billing` },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl text-white">Settings</h1>
          </div>
        </div>
      </header>

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
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content - Default Settings View */}
        <main className="flex-1 bg-gray-900 rounded-lg p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Settings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{item.label}</h3>
                        <p className="text-gray-400 text-sm">Manage {item.label.toLowerCase()} settings</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 
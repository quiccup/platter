'use client'
import { useAuth } from "@/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10" />
            <div className="text-gray-900 text-2xl font-semibold">platter</div>
          </div>
        
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8">
              <Link 
                href="/dashboard" 
                className={`transition-colors ${
                  pathname === '/dashboard' 
                    ? 'text-orange-500 border-b-2 border-orange-500 pb-2'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/settings" 
                className={`transition-colors ${
                  pathname.startsWith('/dashboard/settings')
                    ? 'text-orange-500 border-b-2 border-orange-500 pb-2'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button 
                onClick={() => signOut().then(() => router.push('/sign-in'))}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  )
}
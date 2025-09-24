'use client'

import type { Metadata } from 'next'
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/shadcn-io/dock'
import { Home, Menu, Info, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// export const metadata: Metadata = {
//   title: 'Restaurant Website',
//   description: 'Welcome to our restaurant',
// }

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const subdomain = params.subdomain as string

  const dockItems = [
    {
      title: 'Home',
      icon: (
        <Home className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: `/${subdomain}`,
    },
    {
      title: 'Menu',
      icon: (
        <Menu className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: `/${subdomain}/menu`,
    },
    {
      title: 'About',
      icon: (
        <Info className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: `/${subdomain}/about`,
    },
    {
      title: 'Checkout',
      icon: (
        <ShoppingCart className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: `/${subdomain}/checkout`,
    },
  ]

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen grid grid-rows-4">
          <div className="row-span-1 flex items-center justify-center">
             <Dock className='items-center bg-transparent'>
               {dockItems.map((item, idx) => (
                 <Link key={idx} href={item.href}>
                   <DockItem
                     className='aspect-square'
                   >
                     <DockLabel>{item.title}</DockLabel>
                     <DockIcon>{item.icon}</DockIcon>
                   </DockItem>
                 </Link>
               ))}
             </Dock>
          </div>
          <div className="row-span-3">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

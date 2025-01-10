'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: "Chef's Feed", href: '/admin/chefs-feed', icon: '👨‍🍳' },
  { name: 'Menu', href: '/admin/menu', icon: '🍽️' },
  { name: 'Games', href: '/admin/games', icon: '🎮' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-screen shadow-sm p-4">
      <div className="flex items-center justify-between mb-8 px-4">
        <h1 className="font-display text-xl">Admin Panel</h1>
        <UserButton afterSignOutUrl="/admin" />
      </div>
      
      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            } flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
} 
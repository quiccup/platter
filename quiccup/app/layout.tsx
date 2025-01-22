// This remains a Server Component (no 'use client')
import { Playfair_Display, Lato } from "next/font/google";
import './globals.css';
import { ClientWrapper } from '@/components/client-wrapper';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link';

// Move font configs outside the component
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

export const metadata = {
  title: 'Quiccup | Restaurant Platform',
  description: 'Interactive dining experiences and restaurant management',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${playfair.variable} ${lato.variable} font-sans`}>
          <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="text-2xl font-bold">Quiccup</div>

              <div className="space-x-4">
                <SignedOut>
                  {/* Landing page nav items */}
                  <Link href="/features" className="hover:text-orange-200">Features</Link>
                  <Link href="/pricing" className="hover:text-orange-200">Pricing</Link>
                  <SignInButton />
                </SignedOut>

                <SignedIn>
                  {/* Authenticated nav items */}
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
          </header>
          <main>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
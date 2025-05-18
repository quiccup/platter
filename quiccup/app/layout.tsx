// This remains a Server Component (no 'use client')
import { ClerkProvider } from "@clerk/nextjs";
import { ClientWrapper } from '@/components/client-wrapper';
import './globals.css';
import { Montserrat, Playfair_Display, Lato } from 'next/font/google';

// Move font configs outside the component
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

// Initialize Montserrat font
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'Platter | Better Food Ordering',
  description: 'Design websites for restaurants and bars quickly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${lato.variable} ${montserrat.variable}`}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="font-sans">
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  )
}
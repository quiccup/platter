// This remains a Server Component (no 'use client')
import { Playfair_Display, Lato } from "next/font/google";
import './globals.css';
import { ClientWrapper } from '@/components/client-wrapper';
import { ClerkProvider } from '@clerk/nextjs'

// Move font configs outside the component
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: 'Platter | Restaurant Platform',
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
        <head />
        <body className={`${playfair.variable} ${lato.variable} font-sans`}>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
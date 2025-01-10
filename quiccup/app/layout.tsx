import {
  ClerkProvider,
} from '@clerk/nextjs';
import { Playfair_Display, Lato } from "next/font/google";
import './globals.css';

// Font configurations
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
           <header >
          </header> 
          <main className="min-h-screen">
            
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
              <p className="text-center">© {new Date().getFullYear()} Quiccup. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
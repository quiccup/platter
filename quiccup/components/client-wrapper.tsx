'use client'

import { AuthWrapper } from './auth-wrapper';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthWrapper>
          {children}
       </AuthWrapper>
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-center">© {new Date().getFullYear()} Quiccup. All rights reserved.</p>
             </div>
        </footer>
    </>
  );
} 
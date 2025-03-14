'use client'

import { AuthWrapper } from './auth-wrapper';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthWrapper>
          {children}
       </AuthWrapper>
    </>
  );
} 
'use client'
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [isUserSynced, setIsUserSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function syncUser() {
      if (!clerkUser) {
        setIsUserSynced(true);
        return;
      }

      try {
        // Get JWT token with custom claims
        const token = await getToken({ template: "supabase" });

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        );

        console.log("syncing user");
        console.log(clerkUser);
        // Attempt to upsert the user
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            clerk_id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            first_name: clerkUser.firstName,
            last_name: clerkUser.lastName,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'clerk_id',
            ignoreDuplicates: false,
          });

        if (upsertError) throw upsertError;
        setIsUserSynced(true);

      } catch (e) {
        console.error('Error syncing user:', e);
        setError(e instanceof Error ? e.message : 'An error occurred syncing user');
      }
    }

    if (isLoaded) {
      syncUser();
    }
  }, [isLoaded, clerkUser]);

  // Show loading state while Clerk loads or while syncing user
  if (!isLoaded || !isUserSynced) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render children once everything is ready
  return <>{children}</>;
}
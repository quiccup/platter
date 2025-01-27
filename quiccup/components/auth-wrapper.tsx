'use client'
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { userService } from "@/lib/services/userService";

interface ClerkUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

async function processUser(clerkUser: ClerkUser, userToken: string | null): Promise<{ error: Error | null }> {
  if (!userToken) {
    return {error: new Error("could not process user. userToken not available")};
  }

  return await userService.upsertUser({
    clerkId: clerkUser.id,
    email: clerkUser.email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    createdAt: clerkUser.createdAt,
    updatedAt: clerkUser.updatedAt,
  }, userToken);
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

        // Syncing user with the backend
        let now = new Date().toISOString();
        const { error } = await processUser({
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          createdAt: now,
          updatedAt: now
        }, token);

        if (error) throw error;
        setIsUserSynced(true);
        //     // First create restaurant
        //     const { error: restaurantError } = await supabase
        //       .from('restaurants')
        //       .insert({
        //         user_id: id,
        //         name: first_name ? `${first_name}'s Restaurant` : 'My Restaurant',
        //         email: primaryEmail || '',
        //       })

        //     if (restaurantError) {
        //       console.error('6. Restaurant creation error:', restaurantError);
        //       return new Response('Error creating restaurant', { status: 500 });
        //     }

        //     // Then create billing profile
        //     const { error: billingError } = await supabase
        //       .from('billing_profiles')
        //       .insert({
        //         user_id: id,
        //         subscription_tier: 'free',
        //         trial_ends_at: trialEndDate.toISOString(),
        //         trial_status: 'active',
        //         is_active: true,
        //         current_period_start: new Date().toISOString(),
        //         current_period_end: trialEndDate.toISOString()
        //       })

        //     if (billingError) {
        //       console.error('7. Billing profile creation error:', billingError);
        //       return new Response('Error creating billing profile', { status: 500 });
        //     }

        //     console.log('8. Successfully created restaurant and billing profile')

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

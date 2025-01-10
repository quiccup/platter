import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { addDays } from 'date-fns' // npm install date-fns

export async function POST(req: Request) {
  console.log('1. Webhook endpoint hit')
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.log('2. Missing webhook secret')
    throw new Error('Missing CLERK_WEBHOOK_SECRET')
  }

  // Get the headers
  const headersList = headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log('3. Missing svix headers:', { svix_id, svix_timestamp, svix_signature })
    return new Response('Missing svix headers', { status: 401 })
  }

  try {
    const payload = await req.json()
    console.log('4. Webhook payload:', payload)

    if (payload.type === 'user.created') {
      console.log('5. User created event detected')
      const { id, email_addresses, first_name } = payload.data;
      const primaryEmail = email_addresses[0]?.email_address;
      const trialEndDate = addDays(new Date(), 7) // 7 day trial

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      )

      // First create restaurant
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          user_id: id,
          name: first_name ? `${first_name}'s Restaurant` : 'My Restaurant',
          email: primaryEmail || '',
        })

      if (restaurantError) {
        console.error('6. Restaurant creation error:', restaurantError);
        return new Response('Error creating restaurant', { status: 500 });
      }

      // Then create billing profile
      const { error: billingError } = await supabase
        .from('billing_profiles')
        .insert({
          user_id: id,
          subscription_tier: 'free',
          trial_ends_at: trialEndDate.toISOString(),
          trial_status: 'active',
          is_active: true,
          current_period_start: new Date().toISOString(),
          current_period_end: trialEndDate.toISOString()
        })

      if (billingError) {
        console.error('7. Billing profile creation error:', billingError);
        return new Response('Error creating billing profile', { status: 500 });
      }

      console.log('8. Successfully created restaurant and billing profile')
    }

    return new Response('Success', { status: 200 });
  } catch (err) {
    console.error('9. Error:', err);
    return new Response('Error processing webhook', { status: 400 })
  }
}
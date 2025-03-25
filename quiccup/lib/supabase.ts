import { createClient } from '@supabase/supabase-js'

// Create a client-safe version without server dependencies
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createClient(supabaseUrl, supabaseKey);
}

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export the supabase client as a named export
export const supabase = createClient(supabaseUrl, supabaseKey)

// For backwards compatibility, also export as default
export default createClient(supabaseUrl, supabaseKey)
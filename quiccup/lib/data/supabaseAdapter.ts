import { createClient } from '@supabase/supabase-js';
import { DatabaseAdapter } from "./databaseAdapter";

export class SupabaseAdapter implements DatabaseAdapter {
  async upsert(
    table: string,
    data: Record<string, any>,
    conflictKeys: string[],
    userToken: string
  ): Promise<{ error: Error | null }> {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      }
    );

    // Perform upsert operation
    const { error } = await supabase
      .from(table)
      .upsert(data, {
        onConflict: conflictKeys.join(","),
        ignoreDuplicates: false,
      });

    return { error };
  }
}


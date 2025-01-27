import { SupabaseAdapter } from "./supabaseAdapter";

export interface DatabaseAdapter {
  /**
   * Generic upsert method
   * @param {string} table - The table name.
   * @param {Record<string, any>} data - The data to upsert.
   * @param {string[]} conflictKeys - Keys to resolve conflicts (e.g., primary keys).
   * @param {string} userToken - User token used to connect with the Database
   * @returns {Promise<{ error: Error | null }>} - The result of the operation.
   */
  upsert(
    table: string,
    data: Record<string, any>,
    conflictKeys: string[],
    userToken: string
  ): Promise<{ error: Error | null }>;
}


// Export a singleton instance of SupabaseAdapter
// This should be safe since there is no caching of information on the constructor
export const dbAdapter: DatabaseAdapter = new SupabaseAdapter();

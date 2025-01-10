export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          user_id: string  
          email: string
          phone: string | null
          address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          user_id: string  
          email: string
          phone?: string | null
          address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          user_id?: string  // Changed from owner_id
          email?: string
          phone?: string | null
          address?: string | null
        }
      }
      websites: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          subdomain: string
          custom_domain: string | null
          theme: string
          is_published: boolean
          restaurant_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          subdomain: string
          custom_domain?: string | null
          theme?: string
          is_published?: boolean
          restaurant_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          subdomain?: string
          custom_domain?: string | null
          theme?: string
          is_published?: boolean
          restaurant_id?: string
        }
      }
    }
  }
} 
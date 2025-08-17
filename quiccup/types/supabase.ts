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
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          restaurant_name: string | null
          subdomain: string | null
          custom_domain: string | null
          theme: string | null
          is_published: boolean | null
          content: Json | null
          settings: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          restaurant_name?: string | null
          subdomain?: string | null
          custom_domain?: string | null
          theme?: string | null
          is_published?: boolean | null
          content?: Json | null
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          restaurant_name?: string | null
          subdomain?: string | null
          custom_domain?: string | null
          theme?: string | null
          is_published?: boolean | null
          content?: Json | null
          settings?: Json | null
        }
      }
    }
  }
} 
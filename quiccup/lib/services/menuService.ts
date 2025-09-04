import { createClient } from '@/utils/supabase/client'

export interface MenuItem {
  id?: string
  user_id: string
  name: string
  price: number
  description?: string
  image_url?: string
  tags?: string[]
  created_at?: string
}

export class MenuService {
  protected supabase;

  constructor(customClient?: any) {
    this.supabase = customClient || createClient();
  }

  protected generateEmbeddingText(item: MenuItem): string {
    const parts = [
      item.name,
      item.description || '',
      item.tags?.join(' ') || ''
    ];
    return parts.filter(Boolean).join(' ');
  }

  protected async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      return result.embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  private validateMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): string | null {
    if (!item.name?.trim()) {
      return 'Name is required'
    }

    if (!item.price || item.price <= 0) {
      return 'Price must be greater than 0'
    }

    if (item.price > 10000) {
      return 'Price cannot exceed 10,000'
    }

    if (item.description?.length > 500) {
      return 'Description cannot exceed 500 characters'
    }

    if (item.tags?.some(tag => tag.length > 50)) {
      return 'Tags cannot exceed 50 characters each'
    }

    if (item.tags?.length > 10) {
      return 'Cannot have more than 10 tags'
    }

    return null
  }

  private validateMenuItems(items: Omit<MenuItem, 'id' | 'created_at'>[]): string | null {
    if (!items || items.length === 0) {
      return 'No menu items provided'
    }

    if (items.length > 1000) {
      return 'Cannot import more than 1000 items at once'
    }

    for (const item of items) {
      const error = this.validateMenuItem(item)
      if (error) {
        return `Invalid item "${item.name}": ${error}`
      }
    }

    return null
  }

  async getMenuItems(userId: string): Promise<{ data: MenuItem[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('menu_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<{ data: MenuItem | null; error: any }> {
    const validationError = this.validateMenuItem(item)
    if (validationError) {
      return { data: null, error: { message: validationError } }
    }

    // Generate embedding
    const text = this.generateEmbeddingText(item as MenuItem)
    const embedding = await this.generateEmbedding(text)
    
    const { data, error } = await this.supabase
      .from('menu_items')
      .insert([{
        user_id: item.user_id,
        name: item.name,
        price: item.price,
        description: item.description ?? null,
        image_url: item.image_url ?? null,
        tags: item.tags ?? [],
        embedding: embedding
      }])
      .select()
      .single()

    return { data, error }
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<{ data: MenuItem | null; error: any }> {
    // Get current item to validate and preserve user_id
    const { data: current } = await this.supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single()

    if (!current) {
      return { data: null, error: { message: 'Menu item not found' } }
    }

    // Merge updates with current item for validation
    const mergedItem = {
      ...current,
      ...updates,
      user_id: current.user_id // Ensure we keep the original user_id
    }

    const validationError = this.validateMenuItem(mergedItem)
    if (validationError) {
      return { data: null, error: { message: validationError } }
    }

    // Generate new embedding for the updated item
    const text = this.generateEmbeddingText(mergedItem)
    const embedding = await this.generateEmbedding(text)

    // Remove user_id from updates to prevent changing it
    const { user_id, ...updateFields } = updates

    const { data, error } = await this.supabase
      .from('menu_items')
      .update({ ...updateFields, embedding: embedding })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  async deleteMenuItem(id: string): Promise<{ error: any }> {
    const { error } = await this.supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    return { error }
  }

  async bulkCreateMenuItems(items: Omit<MenuItem, 'id' | 'created_at'>[]): Promise<{ data: MenuItem[] | null; error: any }> {
    if (!items?.length) return { data: [], error: null }

    const validationError = this.validateMenuItems(items)
    if (validationError) {
      return { data: null, error: { message: validationError } }
    }

    // Generate embeddings for each item
    const itemsWithEmbeddings = await Promise.all(
      items.map(async (item) => {
        const text = this.generateEmbeddingText(item as MenuItem)
        const embedding = await this.generateEmbedding(text)
        return { ...item, embedding }
      })
    )

    const { data, error } = await this.supabase
      .from('menu_items')
      .insert(itemsWithEmbeddings.map(item => ({
        user_id: item.user_id,
        name: item.name,
        price: item.price,
        description: item.description ?? null,
        image_url: item.image_url ?? null,
        tags: item.tags ?? [],
        embedding: item.embedding
      })))
      .select()

    return { data, error }
  }
}

export const menuService = new MenuService()
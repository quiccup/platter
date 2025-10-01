// Base types
export interface MenuItem {
    id: string
    name: string
    price: string | number
    description?: string
    image?: string
    tags?: string[]
    category?: string
  }
  
  // Chat-specific types
  export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
  }
  
  export interface OrderResponse {
    type: 'order'
    question: string
    menuItems: MenuItem[]
    followUpQuestion: string
  }
  
  export interface ChatApiResponse {
    response: string
    error?: string
  }
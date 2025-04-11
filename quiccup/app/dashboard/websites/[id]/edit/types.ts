export interface MenuItem {
  title: string
  description: string
  price: string
  image?: string
  tags: string[]
}

export interface ChefPost {
  id: string
  name: string
  content: string
  author: string
  customAuthor?: string
  images?: string[]
  tags?: string[]
  timestamp?: string
}

export interface GalleryData {
  images: string[]
  captions: Record<string, string> // Map of image URLs to captions
}

export interface LeaderboardData {
  title: string
  subtitle?: string
  featuredItems: string[] // IDs of the menu items
}

export interface WebsiteData {
  navbar: {
    heading: string
    subheading: string
    buttons: Array<{ label: string; url: string; openInNewTab: boolean }>
    logo?: string
    coverImage?: string
  }
  menu: {
    items: MenuItem[]
  }
  chefs: {
    posts: ChefPost[]
  }
  about: {
    content: string
  }
  contact: {
    email: string
    phone: string
  }
  gallery: GalleryData
  reviews: any[]
  leaderboard?: LeaderboardData
} 
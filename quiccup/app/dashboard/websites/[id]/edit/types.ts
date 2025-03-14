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
  images: string[]
  tags: string[]
  timestamp: string
}

export interface GalleryData {
  images: string[]
  captions: Record<string, string> // Map of image URLs to captions
}

export interface WebsiteData {
  hero: {
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
} 
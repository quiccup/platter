export interface WebsiteData {
  navbar: {
    heading: string
    subheading: string
    buttons: Array<{
      text: string
      url: string
      variant: 'primary' | 'secondary'
    }>
  }
  menu: {
    items: Array<{
      id?: string
      user_id: string
      name: string
      description?: string
      price: number
      image_url?: string
      tags?: string[]
      created_at?: string
    }>
  }
  chefs: {
    posts: Array<{
      id: string
      title: string
      content: string
      image?: string
      author: string
      date: string
    }>
  }
  about: {
    content: string
  }
  contact: {
    email: string
    phone: string
  }
  gallery: {
    images: string[]
    captions: { [key: string]: string }
  }
  reviews: Array<{
    id: string
    author: string
    rating: number
    comment: string
    date: string
  }>
  leaderboard?: {
    items: Array<{
      id: string
      name: string
      score: number
      rank: number
    }>
  }
  play?: {
    games: Array<{
      id: string
      name: string
      description: string
      image?: string
    }>
  }
}

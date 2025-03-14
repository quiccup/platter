import { ReviewsEdit } from "./Sections/Reviews/ReviewsEdit"
import { HeroEdit } from "./Sections/Hero/HeroEdit"
import { GalleryEdit } from "./Sections/Gallery/GalleryEdit"
import { MenuEditor } from "./Sections/Menu/MenuEdit"
import { Button } from "@/components/ui/button"
import { ChefPostModal } from "./Sections/ChefsFeed/ChefPostModal"
import { useState } from "react"
import { ChefHat, Trash2 } from "lucide-react"
import { AboutEdit } from "./Sections/About/AboutEdit"

interface SectionEditorProps {
  section: string
  data: any
  onChange: (newData: any) => void
}

export function SectionEditor({ section, data, onChange }: SectionEditorProps) {
  const [chefPostModalOpen, setChefPostModalOpen] = useState(false)

  switch (section) {
    case 'hero':
      return (
        <div className="space-y-4">
         <HeroEdit data={data} onChange={onChange} />
        </div>
      )
    case 'menu':
      return (<div>
        <MenuEditor data={data} onChange={onChange} />
      </div>)
    case 'chefs':
      return (
        <div className="space-y-4">
          <Button 
            onClick={() => setChefPostModalOpen(true)} 
            variant="default"
            className="w-full"
          >
            Manage Posts
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Share your culinary creations and kitchen stories
          </p>

          <ChefPostModal 
            open={chefPostModalOpen}
            onOpenChange={setChefPostModalOpen}
            posts={data.posts || []}
            onSave={(post) => {
              const currentPosts = data.posts || []
              onChange({ 
                ...data, 
                posts: [post, ...currentPosts]
              })
            }}
            onDelete={(postId) => {
              const newPosts = data.posts.filter((p: any) => p.id !== postId)
              onChange({ ...data, posts: newPosts })
            }}
          />
        </div>
      )
    case 'about':
      return <AboutEdit data={data} onChange={onChange} />
    case 'contact':
      return <div>Contact Section</div>  
    case 'reviews':
      return <ReviewsEdit/>
    case 'gallery':
      return <GalleryEdit data={data} onChange={onChange} /> 
    default:
      return null;
  }
} 
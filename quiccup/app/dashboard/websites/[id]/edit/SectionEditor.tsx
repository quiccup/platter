import { ReviewsEdit } from "./Sections/Reviews/ReviewsEdit"
import { HeroEdit } from "./Sections/Hero/HeroEdit"
import { GalleryEdit } from "./Sections/Gallery/GalleryEdit"

interface SectionEditorProps {
  section: string
  data: any
  onChange: (newData: any) => void
}

export function SectionEditor({ section, data, onChange }: SectionEditorProps) {
  switch (section) {
    case 'hero':
      return (
        <div className="space-y-4">
         <HeroEdit data={data} onChange={onChange} />
        </div>
      )
    case 'menu':
      return <div>Menu Section</div>  
    case 'chefs':
      return <div>Chefs Section</div>  
    case 'about':
      return <div>About Section</div>  
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
'use client'

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trophy, Home, Menu as MenuIcon, ChefHat, Info, Phone, Star, Image, GripVertical, ChevronRight } from "lucide-react"
import { ReviewsEdit } from "./Sections/Reviews/ReviewsEdit"
import { NavbarEdit } from "./Sections/Navbar/NavbarEdit"
import { GalleryEdit } from "./Sections/Gallery/GalleryEdit"
import { MenuEditor } from "./Sections/Menu/MenuEdit"
import { AboutEdit } from "./Sections/About/AboutEdit"
import { LeaderboardEdit } from './Sections/Leaderboard/LeaderboardEdit'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChefPostModal } from "./Sections/ChefsFeed/ChefPostModal"
import { ChefsFeedEdit } from "./Sections/ChefsFeed/ChefsFeedEdit"

interface Section {
  id: string
  name: string
  icon: React.ReactNode
}

const sections: Section[] = [
  { id: 'navbar', name: 'Navbar', icon: <Home className="w-5 h-5" /> },
  { id: 'leaderboard', name: 'Top Dishes', icon: <Trophy className="w-5 h-5" /> },
  { id: 'menu', name: 'Menu', icon: <MenuIcon className="w-5 h-5" /> },
  { id: 'chefs', name: 'Chefs Feed', icon: <ChefHat className="w-5 h-5" /> },
  { id: 'gallery', name: 'Gallery', icon: <Image className="w-5 h-5" /> },
  { id: 'about', name: 'About Us', icon: <Info className="w-5 h-5" /> },
  { id: 'contact', name: 'Contact', icon: <Phone className="w-5 h-5" /> },
  { id: 'reviews', name: 'Reviews', icon: <Star className="w-5 h-5" /> },
]

function SortableItem({ section, onEdit, isCollapsed }: { section: Section; onEdit: () => void; isCollapsed?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2
        ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2'}
        rounded-md cursor-pointer 
        hover:bg-accent/50 
        transition-colors 
        group
      `}
      onClick={onEdit}
    >
      {!isCollapsed && (
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="text-muted-foreground">{section.icon}</div>
      {!isCollapsed && (
        <>
          <div className="flex-1 text-sm text-foreground">{section.name}</div>
          <Button 
            variant="ghost" 
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  )
}

interface SectionEditorProps {
  sectionOrder: string[]
  onOrderChange: (newOrder: string[]) => void
  data: WebsiteData
  onChange: (sectionId: string, newData: any) => void
  websiteId: string
  isCollapsed?: boolean
}

export function SectionEditor({ sectionOrder, onOrderChange, data, onChange, websiteId, isCollapsed }: SectionEditorProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id)
      const newIndex = sectionOrder.indexOf(over.id)
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex)
      onOrderChange(newOrder)
    }
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'navbar':
        return <NavbarEdit data={data.navbar} onChange={(newData) => onChange('navbar', newData)} />
      case 'menu':
        return <MenuEditor 
          data={data.menu} 
          onChange={(newData) => onChange('menu', newData)} 
          websiteId={websiteId}
        />
      case 'chefs':
        return <ChefsFeedEdit
          websiteId={websiteId}
          data={{
            posts: data.chefs?.posts || [],
            restaurantName: data.navbar?.heading
          }}
          onChange={(newData) => {
            console.log('ChefsFeed update:', newData);
            onChange('chefs', { posts: newData.posts });
          }}
        />
      case 'about':
        return <AboutEdit data={data.about} onChange={(newData) => onChange('about', newData)} />
      case 'reviews':
        return <ReviewsEdit data={data.reviews} onChange={(newData) => onChange('reviews', newData)} />
      case 'gallery':
        return <GalleryEdit data={data.gallery} onChange={(newData) => onChange('gallery', newData)} />
      case 'leaderboard':
        return (
          <LeaderboardEdit 
            data={data.leaderboard} 
            onChange={(newData) => onChange('leaderboard', newData)} 
            websiteId={websiteId}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-0.5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((sectionId) => {
            const section = sections.find(s => s.id === sectionId)
            if (!section) return null
            
            return (
              <SortableItem
                key={section.id}
                section={section}
                onEdit={() => setActiveSection(section.id)}
                isCollapsed={isCollapsed}
              />
            )
          })}
        </SortableContext>
      </DndContext>

      {activeSection && (
        <Dialog open={!!activeSection} onOpenChange={() => setActiveSection(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {renderSectionContent()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { SectionEditor } from './SectionEditor'
import { FinalProduct } from './FinalProduct'
import { NavUser } from '@/app/editor/components/nav-user'
import { Button } from "@/components/ui/button"
import { PreviewThemeProvider } from '@/components/preview-theme-provider'
import { 
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'
import { WebsiteData, MenuItem, RestaurantInfo } from './types'
import { toast } from 'sonner'

// Default data structures
const DEFAULT_WEBSITE_DATA: WebsiteData = {
  navbar: { heading: '', subheading: '', buttons: [] },
  menu: { items: [] },
  chefs: { posts: [] },
  about: { content: '' },
  contact: { email: '', phone: '' },
  gallery: { images: [] },
  reviews: [],
  theme: 'light'
}

const DEFAULT_SECTION_ORDER = [
  'navbar',
  'leaderboard',
  'menu',
  'chefs',
  'gallery',
  'about',
  'contact',
  'reviews'
]

export const useWebsiteData = (websiteId: string) => {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null)
  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadWebsiteData = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase
          .from('websites')
          .select('content, section_order')
          .eq('id', websiteId)
          .single()

        if (error) throw error
        
        // retrieve menu data
        const { data: menu, error: menuError } = await supabase
          .from('websites')
          .select(`
            id,
            name,
            menu_items (
              id,
              name,
              price,
              description,
              menu_item_tag_map (
                tags(name)
              )
            )
          `)
          .eq('id', websiteId)
          .single()

        if (menuError) throw menuError

        const normalizedMenu: MenuItem[] = (menu.menu_items || []).map((item: any) => ({
          id: item.id,
          title: item.name,
          description: item.description,
          price: item.price.toString(),
          image: '',
          tags: item.menu_item_tag_map?.map((m: any) => m.tags.name) || []
        }))
        
        setRestaurantInfo({ id: menu.id, restaurantName: menu.name, menuItems: normalizedMenu })

        // Merge into legacy blob
        const mergedContent: WebsiteData = {
          ...(data.content || DEFAULT_WEBSITE_DATA),
          menu: { items: normalizedMenu }
        }

        setWebsiteData(mergedContent)
        setSectionOrder(data.section_order || DEFAULT_SECTION_ORDER)
      } catch (error) {
        console.error('Error loading website data:', error)
        toast.error('Failed to load website data')
      }
    }
    loadWebsiteData()
  }, [websiteId])


  const handleContentChange = (sectionId: keyof WebsiteData, newData: any) => {
    setWebsiteData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [sectionId]: { ...prev[sectionId], ...newData }
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleSectionOrderChange = (newOrder: string[]) => {
    setSectionOrder(newOrder)
    setHasUnsavedChanges(true)
  }

  const saveAllChanges = async () => {
    if (!websiteData) return;
    
    setIsSaving(true)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('websites')
        .update({ 
          content: websiteData,
          section_order: sectionOrder 
        })
        .eq('id', websiteId)

      if (error) throw error

      toast.success('Changes saved successfully')
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving website:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    websiteData,
    restaurantInfo,
    sectionOrder,
    isSaving,
    hasUnsavedChanges,
    handleContentChange,
    handleSectionOrderChange,
    saveAllChanges
  }
}


// Preview Header Component
const PreviewHeader = ({
  isSaving,
  hasUnsavedChanges,
  saveAllChanges,
  setIsMobileView,
  isMobileView,
  websiteId
}: {
  isSaving: boolean
  hasUnsavedChanges: boolean
  saveAllChanges: () => void
  setIsMobileView: (value: boolean) => void
  isMobileView: boolean
  websiteId: string
}) => {
  const router = useRouter()
  
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <Button 
        onClick={() => router.push('/dashboard')} 
        variant="ghost" 
        size="sm"
      >
        <ChevronLeftIcon className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={saveAllChanges}
          disabled={isSaving}
          variant="outline"
          size="sm"
          className={`
            ${hasUnsavedChanges 
              ? "border-2 border-black text-black hover:bg-black hover:text-white transition-colors rounded-full px-6" 
              : "text-muted-foreground"
            }
          `}
        >
          {isSaving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileView(!isMobileView)}
          className="text-gray-600"
        >
          <DevicePhoneMobileIcon className="w-4 h-4" />
          <span className="ml-2">{isMobileView ? 'Desktop View' : 'Mobile View'}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/websites/${websiteId}`)}
          className="text-gray-600"
        >
          <ArrowsPointingOutIcon className="w-4 h-4" />
          <span className="ml-2">Full Screen</span>
        </Button>
      </div>
    </div>
  )
}

// Preview Area Component
const PreviewArea = ({
  isMobileView,
  isSaving,
  hasUnsavedChanges,
  saveAllChanges,
  sectionOrder,
  websiteData,
  setIsMobileView,
  websiteId,
  restaurantInfo
}: {
  isMobileView: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  saveAllChanges: () => void
  sectionOrder: string[]
  websiteData: WebsiteData
  setIsMobileView: (value: boolean) => void
  websiteId: string
  restaurantInfo: {
    name: string
    menuItems: MenuItem[]
  }
}) => (
  <SidebarInset className="w-full min-w-0">
    <PreviewHeader 
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveAllChanges={saveAllChanges}
      setIsMobileView={setIsMobileView}
      isMobileView={isMobileView}
      websiteId={websiteId}
    />
    
    <main className="p-4 h-[calc(100vh-65px)] overflow-y-auto">
      <div className={`bg-white rounded-lg border overflow-hidden ${
        isMobileView ? 'max-w-md mx-auto shadow-xl' : ''}`}
      >
        <FinalProduct 
          data={restaurantInfo}
          sectionOrder={sectionOrder}
        />
      </div>    
    </main>
  </SidebarInset>
)

// Sidebar Component
const EditorSidebar = ({
  isCollapsed,
  setIsCollapsed,
  websiteData,
  sectionOrder,
  handleContentChange,
  handleSectionOrderChange,
  websiteId
}: {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  websiteData: WebsiteData
  sectionOrder: string[]
  handleContentChange: (sectionId: keyof WebsiteData, newData: any) => void
  handleSectionOrderChange: (newOrder: string[]) => void
  websiteId: string
}) => {
  const router = useRouter()
  
  return (
    <div className="relative">
      <Sidebar className={`transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div 
          className="absolute -right-3 top-6 z-50 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-accent flex items-center justify-center">
            {isCollapsed 
              ? <ChevronRightIcon className="h-3 w-3" /> 
              : <ChevronLeftIcon className="h-3 w-3" />
            }
          </div>
        </div>

        <SidebarContent>
          <div className="flex flex-col h-full">
            <div className="py-3 px-4">
              {!isCollapsed && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start -ml-2 text-sm"
                  onClick={() => router.push('/dashboard')}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}
            </div>

            <div className="px-2 flex-1">
              <SectionEditor 
                sectionOrder={sectionOrder}
                onOrderChange={handleSectionOrderChange}
                data={websiteData}
                onChange={handleContentChange}
                websiteId={websiteId}
                isCollapsed={isCollapsed}
              />
            </div>

            <SidebarFooter className="px-4 py-4 mt-auto">
              <NavUser collapsed={isCollapsed} />
            </SidebarFooter>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

// Main component
export default function EditWebsitePage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.id as string
  
  const {
    websiteData,
    restaurantInfo,
    sectionOrder,
    isSaving,
    hasUnsavedChanges,
    handleContentChange,
    handleSectionOrderChange,
    saveAllChanges
  } = useWebsiteData(websiteId)

  const [isMobileView, setIsMobileView] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!websiteData || !restaurantInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <PreviewThemeProvider initialTheme="light">
      <SidebarProvider>
        <div className="grid grid-cols-[auto,1fr] h-screen">
          <EditorSidebar 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            websiteData={websiteData}
            sectionOrder={sectionOrder}
            handleContentChange={handleContentChange}
            handleSectionOrderChange={handleSectionOrderChange}
            websiteId={websiteId}
          />
          
          <PreviewArea
            isMobileView={isMobileView}
            isSaving={isSaving}
            hasUnsavedChanges={hasUnsavedChanges}
            saveAllChanges={saveAllChanges}
            sectionOrder={sectionOrder}
            websiteData={websiteData}
            restaurantInfo={restaurantInfo}
            setIsMobileView={setIsMobileView}
            websiteId={websiteId}
          />
        </div>
      </SidebarProvider>
    </PreviewThemeProvider>
  )
}
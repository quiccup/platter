'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { debounce } from 'lodash'
import { createClient } from '@/utils/supabase/client'
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
import {
  Trophy, Home, UtensilsCrossed, ChefHat, Info, PhoneCall, Star,
  Image, Smartphone, Expand
} from "lucide-react"
import { WebsiteData, MenuItem, RestaurantInfo } from './types'
import { toast } from 'sonner'

export default function EditWebsitePage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.id as string

  const [isMobileView, setIsMobileView] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    navbar: {
      heading: '',
      subheading: '',
      buttons: [],
    },
    menu: {
      items: []
    },
    chefs: {
      posts: []
    },
    about: {
      content: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    gallery: {
      images: [],
      captions: {}
    },
    reviews: [],
})
  const [sidebarWidth, setSidebarWidth] = useState<'collapsed' | 'normal' | 'expanded'>('normal')
  const [sectionOrder, setSectionOrder] = useState([
    'navbar',
    'leaderboard',
    'menu',
    'chefs',
    'gallery',
    'about',
    'contact',
    'reviews'
  ])
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const sections = [
    { id: 'leaderboard', label: 'Top Dishes', icon: Trophy },
    { id: 'navbar', label: 'Navbar', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'chefs', label: 'Chefs Feed', icon: ChefHat },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: Image }
  ]

  // Load initial data - update to also load section_order and menu items from dedicated table
  useEffect(() => {
    const loadWebsiteData = async () => {
      try {
        const supabase = createClient()
        
        // Load website data
        const { data: websiteData, error: websiteError } = await supabase
          .from('websites')
          .select('content, section_order')
          .eq('id', websiteId)
          .single()

        if (websiteError) throw websiteError

        // Load menu items from dedicated table
        const { data: menuItems, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('website_id', websiteId)

        if (menuError) throw menuError

        // Transform menu items to match the expected format
        const transformedMenuItems = menuItems?.map(item => ({
          id: item.id?.toString() ?? String(idx),
          title: item.name,
          description: item.description || '',
          price: item.price?.toString() || '',
          image: item.image_url || '',
          tags: [], // We'll need to add tags support later if needed
        })) || []

        if (websiteData?.content) {
          setWebsiteData({
            ...websiteData.content,
            menu: {
              items: transformedMenuItems
            }
          })
        } else {
          setWebsiteData(prev => ({
            ...prev,
            menu: {
              items: transformedMenuItems
            }
          }))
        }
        
        // Set section order if it exists in database
        if (websiteData?.section_order) {
          setSectionOrder(websiteData.section_order)
        }
      } catch (error) {
        console.error('Error loading website data:', error)
        toast.error('Failed to load website data')
      }
    }
    loadWebsiteData()
  }, [websiteId])

  // Update handleContentChange to better handle nested updates
  const handleContentChange = (sectionId: string, newData: any) => {
    console.log('Content change:', sectionId, newData); // Debug log
    
    setWebsiteData(prev => {
      if (!prev) return prev;

      let updatedSection;
      if (sectionId === 'chefs') {
        // Special handling for chefs section
        updatedSection = {
          ...prev[sectionId as keyof WebsiteData],
          ...newData,
          posts: Array.isArray(newData.posts) ? newData.posts : (prev[sectionId as keyof WebsiteData] as any)?.posts
        };
      } else if (sectionId === 'menu') {
        // Special handling for menu section - save to dedicated table
        updatedSection = {
          ...prev[sectionId as keyof WebsiteData],
          ...newData
        };
        
        // Save menu items to dedicated table
        saveMenuItemsToDatabase(newData.items || []);
      } else {
        // General handling for other sections
        updatedSection = typeof newData === 'object' && newData !== null
          ? { ...(prev[sectionId as keyof WebsiteData] as any), ...newData }
          : newData;
      }

      const updatedData = {
        ...prev,
        [sectionId]: updatedSection
      };

      console.log('Updated website data:', updatedData); // Debug log
      setHasUnsavedChanges(true);
      return updatedData;
    });
  };

  // Function to save menu items to the dedicated table
  const saveMenuItemsToDatabase = async (menuItems: any[]) => {
    try {
      const supabase = createClient()

      // First, delete existing menu items for this website
      await supabase
        .from('menu_items')
        .delete()
        .eq('website_id', websiteId)

      // Then insert new menu items
      if (menuItems.length > 0) {
        const itemsToInsert = menuItems.map(item => ({
          website_id: websiteId,
          name: item.title,
          price: parseFloat(item.price) || 0,
          description: item.description || '',
          image_url: item.image || '',
        }))

        const { error: insertError } = await supabase
          .from('menu_items')
          .insert(itemsToInsert)

        if (insertError) {
          console.error('Error saving menu items:', insertError)
          toast.error('Failed to save menu items')
        }
      }
    } catch (error) {
      console.error('Error saving menu items:', error)
      toast.error('Failed to save menu items')
    }
  }

  // Update section order handler
  const handleSectionOrderChange = (newOrder: string[]) => {
    setSectionOrder(newOrder)
    setHasUnsavedChanges(true)
  }

  const saveAllChanges = async () => {
    if (!websiteData) return;
    
    setIsSaving(true)
    try {
      const supabase = createClient();
      
      // First, validate the data structure
      if (!websiteData.chefs?.posts) {
        console.error('Invalid chefs data structure');
        toast.error('Invalid data structure');
        return;
      }

      // Save website content (excluding menu items which are saved separately)
      const { data, error } = await supabase
        .from('websites')
        .update({ 
          content: {
            ...websiteData,
            menu: { items: [] } // Don't save menu items in content
          },
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

  const restaurantInfo = {
    id: websiteId,
    name: websiteData?.navbar?.heading ?? '',
    menuItems: (websiteData?.menu?.items ?? []).map((item, i) => ({
      id: item?.id ?? String(i),
      title: item?.title ?? '',
      description: item?.description ?? '',
      price: item?.price ?? '',
      image: item?.image ?? '',
      tags: item?.tags ?? [],
    })),
  }
  return (
    <PreviewThemeProvider>
      <SidebarProvider>
        <div className="flex w-full">
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
            setIsMobileView={setIsMobileView}
            websiteId={websiteId}
            restaurantInfo={restaurantInfo}
          />
        </div>
      </SidebarProvider>
    </PreviewThemeProvider>
  )

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
            {isCollapsed ? <ChevronRightIcon className="h-3 w-3" /> : <ChevronLeftIcon className="h-3 w-3" />}
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
              <NavUser />
            </SidebarFooter>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
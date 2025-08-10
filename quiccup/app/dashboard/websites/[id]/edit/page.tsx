'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { debounce } from 'lodash'
import { createClient } from '@/utils/supabase/client'
import { SectionEditor } from './SectionEditor'
import { FinalProduct } from './FinalProduct'
import { 
  ChevronLeftIcon, 
} from '@heroicons/react/24/outline'
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarFooter,

} from "@/components/ui/sidebar"
import { 
  Home,
  UtensilsCrossed,
  ChefHat,
  Info,
  PhoneCall,
  Star,
  Image,
  ChevronRight,
  ChevronLeft,
  Expand,
  Smartphone,
  Trophy,
} from 'lucide-react'

import { NavUser } from '@/app/editor/components/nav-user'
import { Button } from "@/components/ui/button"
import { PreviewThemeProvider } from '@/components/preview-theme-provider'
import { PreviewThemeToggle } from '@/components/preview-theme-toggle'
import { WebsiteData } from './types'
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
    reviews: []
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
    async function loadWebsiteData() {
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

  // Update saveAllChanges to include better error handling and logging
  const saveAllChanges = async () => {
    setIsSaving(true);
    console.log('Saving website data:', websiteData); // Debug log
    
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
        .select();
      
      if (error) {
        console.error('Error saving website:', error);
        toast.error('Failed to save changes');
        return;
      }

      console.log('Save successful:', data); // Debug log
      toast.success('Changes saved successfully');
      setHasUnsavedChanges(false);

      // Refresh the data after saving
      if (data?.[0]?.content) {
        setWebsiteData(data[0].content);
      }
    } catch (error) {
      console.error('Error saving website:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state if data hasn't loaded
  if (!websiteData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <PreviewThemeProvider initialTheme={'light'}>
      <SidebarProvider>
        <div className="grid grid-cols-[auto,1fr] h-screen">
          <div className="relative">
            <Sidebar className={`transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-64'}`}>
              <div 
                className="absolute -right-3 top-6 z-50 cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <div className="h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-accent flex items-center justify-center">
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronLeft className="h-3 w-3" />
                  )}
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
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    )}
                  </div>

                  <div className="px-2 flex-1">
                    {!isCollapsed && (
                      <div className="mb-2 px-2">
                        <h2 className="text-sm font-medium text-muted-foreground">Sections</h2>
                      </div>
                    )}

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

          {/* Preview Area */}
          <SidebarInset className="w-full min-w-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button onClick={() => router.push('/dashboard')} variant="ghost" size="sm">
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {/* <PreviewThemeToggle /> */}
                
                {/* Add Save Button */}
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
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    hasUnsavedChanges ? "Save" : "Saved"
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileView(!isMobileView)}
                  className="text-gray-600"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="ml-2">{isMobileView ? 'Desktop View' : 'Mobile View'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/dashboard/websites/${params.id}`)}
                  className="text-gray-600"
                >
                  <Expand className="w-4 h-4" />
                  <span className="ml-2">Full Screen</span>
                </Button>
              </div>
            </div>
            
            <main className="p-4 h-[calc(100vh-65px)] overflow-y-auto">
              <div className={`bg-white rounded-lg border overflow-hidden ${
                isMobileView ? 'max-w-md mx-auto shadow-xl' : ''}`}
              >
                <FinalProduct 
                  data={{
                    data: {
                      navbar: {
                        heading: websiteData.navbar.heading,
                        address: websiteData.navbar.subheading
                      },
                      menu: {
                        items: websiteData.menu.items.map((item, index) => ({
                          id: index.toString(),
                          name: item.title,
                          price: item.price,
                          image: item.image
                        }))
                      }
                    }
                  }}
                />
              </div>    
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PreviewThemeProvider>
  )
}
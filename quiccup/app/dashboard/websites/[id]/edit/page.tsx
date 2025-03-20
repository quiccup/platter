'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { debounce } from 'lodash'
import { createClient } from '@supabase/supabase-js'
import { SectionEditor } from './SectionEditor'
import { FinalProduct } from './FinalProduct'
import { 
  ChevronLeftIcon, 
} from '@heroicons/react/24/outline'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarInset,
  SidebarProvider,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { 
  Home,
  UtensilsCrossed,
  ChefHat,
  Info,
  PhoneCall,
  Star,
  Image,
  Command,
  AudioWaveform,
  GalleryVerticalEnd,
  ChevronRight,
  Expand,
  Smartphone,
  Trophy,
  Moon,
  Sun
} from 'lucide-react'
import { TeamSwitcher } from '@/app/editor/components/team-switcher'
import { NavUser } from '@/app/editor/components/nav-user'
import { NavProjects } from '@/app/editor/components/nav-projects'
import { Button } from "@/components/ui/button"
import { PreviewThemeProvider } from '@/components/preview-theme-provider'
import { PreviewThemeToggle } from '@/components/preview-theme-toggle'
import { SidebarItem } from '@/components/sidebar-item'
import { DockMenu } from './components/ui/DockMenu'
import { EditorSection } from './EditorSection'
import { sectionsConfig } from './config'
import { WebsiteData } from './types'
import { toast } from 'sonner'

export default function EditWebsitePage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.id as string
  
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<{ user: { name: string, email: string, avatar: string }}|null>(null)
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    hero: {
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
      images: []
    },
    reviews: [],
    theme: 'dark' // Default theme
  })
  const [sidebarWidth, setSidebarWidth] = useState<'collapsed' | 'normal' | 'expanded'>('normal')

  const sections = [
    { id: 'leaderboard', label: 'Top Dishes', icon: Trophy },
    { id: 'hero', label: 'Landing', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'chefs', label: 'Chefs Feed', icon: ChefHat },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: Image }
  ]

  // Set mounted on initial client render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial data
  useEffect(() => {
    async function loadWebsiteData() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase
          .from('websites')
          .select('content')
          .eq('id', websiteId)
          .single()

        if (error) throw error

        if (data?.content) {
          // Validate data structure before setting
          const content = data.content as WebsiteData
          setWebsiteData(content)
        }
      } catch (error) {
        console.error('Error loading website data:', error)
        // Handle error appropriately
      }
    }
    
    loadWebsiteData()
  }, [websiteId])

  // Safe update function
  const handleContentChange = (sectionId: keyof WebsiteData, newData: any) => {
    if (!websiteData) return // Don't update if no data loaded

    setWebsiteData(prev => {
      if (!prev) return prev // Extra safety check

      const updatedData = {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          ...newData
        }
      }

      // Debounced save
      debouncedSave(updatedData)

      return updatedData
    })
  }

  // Safer save function
  const saveToDatabase = async (content: WebsiteData) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('websites')
        .update({ content })
        .eq('id', websiteId)

      if (error) throw error
      
    } catch (error) {
      console.error('Error saving website data:', error)
      // Handle error appropriately
    }
  }

  const debouncedSave = debounce(saveToDatabase, 1000)

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setWebsiteData(prevData => ({
      ...prevData,
      theme: newTheme
    }))
  }

  const saveWebsite = async () => {
    setIsSaving(true)
    
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('websites')
        .update({ content: websiteData })
        .eq('id', websiteId)
        
      if (error) {
        console.error('Error saving website:', error)
        toast.error('Failed to save website')
      } else {
        toast.success('Website saved successfully')
      }
    } catch (error) {
      console.error('Error saving website:', error)
      toast.error('Failed to save website')
    } finally {
      setIsSaving(false)
    }
  }

  const publishWebsite = async () => {
    setIsPublishing(true)
    
    try {
      // Save first
      await saveWebsite()
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('websites')
        .update({ published: true, published_at: new Date().toISOString() })
        .eq('id', websiteId)
        
      if (error) {
        console.error('Error publishing website:', error)
        toast.error('Failed to publish website')
      } else {
        toast.success('Website published successfully')
      }
    } catch (error) {
      console.error('Error publishing website:', error)
      toast.error('Failed to publish website')
    } finally {
      setIsPublishing(false)
    }
  }

  // Show loading state if data hasn't loaded
  if (!websiteData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <PreviewThemeProvider initialTheme={websiteData.theme || 'dark'}>
      <SidebarProvider>
        <div className="grid grid-cols-[auto,1fr] h-screen">
          <Sidebar 
            collapsible="icon"
            className={`transition-all duration-300 border-r ${
              sidebarWidth === 'collapsed' ? 'w-[50px]' : 
              'w-[280px]'
            }`}
          >
            <SidebarHeader>
              <TeamSwitcher teams={data?.teams || []} />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Sections</SidebarGroupLabel>
                <SidebarMenu>
                  {sections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className={`w-full px-2 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-3 group ${
                          activeSection === section.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <section.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate group-[[data-collapsed=true]]:hidden text-sm">
                            {section.label}
                          </span>
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            activeSection === section.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Section Editor Panel */}
                      {activeSection === section.id && (
                        <div className="p-4 border-l ml-4 mt-2">
                          <SectionEditor 
                            section={section.id}
                            data={(websiteData as any)[section.id]}
                            onChange={(newData) => handleContentChange(section.id, newData)}
                            websiteId={websiteId}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              <NavProjects projects={data?.projects || []} />
            </SidebarContent>
            <SidebarFooter>
              <NavUser user={data?.user || { name: '', email: '', avatar: '' }} />
            </SidebarFooter>
            <SidebarRail />
            
            {/* Add resize button at the bottom */}
            <button
              onClick={() => setSidebarWidth(state => 
                state === 'normal' ? 'expanded' : 
                state === 'expanded' ? 'collapsed' : 
                'normal'
              )}
              className="absolute bottom-4 right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeftIcon className={`w-4 h-4 transition-transform ${
                sidebarWidth === 'expanded' ? 'rotate-180' : ''
              }`} />
            </button>
          </Sidebar>

          {/* Preview Area */}
          <SidebarInset className="w-full min-w-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button onClick={() => router.push('/dashboard')} variant="ghost" size="sm">
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </div>
              
              {/* Add the preview theme toggle */}
              <PreviewThemeToggle />
              
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
                <FinalProduct data={websiteData} />
              </div>    
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PreviewThemeProvider>
  )
}
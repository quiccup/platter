'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { debounce } from 'lodash'
import { createClient } from '@supabase/supabase-js'
import { PreviewButton } from './PreviewButton'
import { SectionEditor } from './SectionEditor'
import { FinalProduct } from './FinalProduct'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon
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
  PlusIcon,
  PencilIcon
} from 'lucide-react'
import { TeamSwitcher } from '@/app/editor/components/team-switcher'
import { NavUser } from '@/app/editor/components/nav-user'
import { NavProjects } from '@/app/editor/components/nav-projects'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb'
import { SectionModal } from './components/section-modal'
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { HeroEditor } from './InlineEditors/HeroEditor'
import { HeroEdit } from './Sections/Hero/HeroEdit'

export default function EditWebsitePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const params = useParams()
  const websiteId = params.id as string
  
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [websiteData, setWebsiteData] = useState({
    hero: { heading: '', description: '' },
    menu: [],
    chefs: [
      {
        title: "Lemon Herb Salmon",
        description: "Our signature dish combines fresh Atlantic salmon with a delicate blend of Mediterranean herbs and zesty lemon. A perfect harmony of flavors!",
        duration: "45 min",
        image: "/images/salmon.jpg"
      },
      {
        title: "Chocolate Truffle Tart",
        description: "A decadent dessert featuring rich Belgian chocolate and toasted hazelnuts, finished with a gold leaf garnish. Pure indulgence!",
        duration: "45 min",
        image: "/images/chocolate-tart.jpg"
      },
      {
        title: "Herb-Crusted Sea Bass",
        description: "Fresh Mediterranean sea bass encrusted with aromatic herbs and served with seasonal vegetables. A taste of coastal elegance.",
        duration: "45 min",
        image: "/images/sea-bass.jpg"
      }
    ],
    about: { content: '' },
    contact: { email: '', phone: '' },
    gallery: [],
    reviews: []
  })
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const sections = [
    { id: 'hero', label: 'Landing', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'chefs', label: 'Chefs Feed', icon: ChefHat },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: Image }
  ]

  const data = {
    teams: [
      { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
      { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
      { name: 'Evil Corp.', logo: Command, plan: 'Free' },
    ],
    user: {
      name: 'Nouman Abidi',
      email: 'nouman@quiccup.co',
      avatar: '/images/avatar.png'
    },
    projects: [
      { name: 'Acme Inc', url: '/', icon: GalleryVerticalEnd },
      { name: 'Acme Corp.', url: '/', icon: AudioWaveform },
      { name: 'Evil Corp.', url: '/', icon: Command },
    ]
  }


  // Set mounted on initial client render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial data
  useEffect(() => {
    if (!mounted) return

    async function loadWebsiteData() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data, error } = await supabase
        .from('websites')
        .select('content')
        .eq('id', websiteId)
        .single()

      if (data?.content) {
        setWebsiteData(data.content)
      }
    }
    
    loadWebsiteData()
  }, [websiteId, mounted])

  // Auto-save functionality
  const saveToDatabase = async (content: any) => {
    if (!mounted) return

    setSaveStatus('saving')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    try {
      await supabase
        .from('websites')
        .update({ content })
        .eq('id', websiteId)
      setSaveStatus('saved')
    } catch (error) {
      setSaveStatus('error')
      console.error('Error saving:', error)
    }
  }

  // Debounced auto-save
  const debouncedSave = debounce(saveToDatabase, 1000)

  // Call auto-save whenever content changes
  useEffect(() => {
    if (!mounted) return
    debouncedSave(websiteData)
  }, [websiteData, mounted])

  const handleContentChange = (sectionId: string, newData: any) => {
    setWebsiteData(prev => ({
      ...prev,
      [sectionId]: newData
    }))
  }

  // Return loading state until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const onSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsModalOpen(true)
  }

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
          </SidebarHeader>
          <SidebarContent>
          <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
           <SidebarMenu>
           
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSectionClick(section.id)} 
                    className={`w-full px-2 py-2 text-left hover:bg-gray-100 flex items-center gap-3 group ${
                      activeSection === section.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <section.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate group-[[data-collapsed=true]]:hidden text-sm">
                      {section.label}
                    </span>
                  </button>
                ))}
              </nav>
              </SidebarMenu>
              </SidebarGroup>
              <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
              <NavUser user={data.user} />
            </SidebarFooter>
      
          <SidebarRail />     
        </Sidebar>

        {/* <SidebarInset className="p-0 m-0">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <h2 className="font-medium">Edit Website</h2>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex gap-2 border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-gray-100' : ''}`}
                >
                  <ComputerDesktopIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-gray-100' : ''}`}
                >
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                </button>
              </div>
              <a
                href={`/${websiteId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
              >
                Preview Website
              </a>
            </div>
          </header>

          <div className="flex h-[calc(100vh-3.5rem)]">
            <div className="flex overflow-auto p-4">
              <div className={`mx-auto transition-all duration-300 ${
                viewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'
              }`}>
                <WebsitePreview data={websiteData} />
              </div>
            </div>
          </div>
        </SidebarInset> */}
         <SidebarInset>  
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Website
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex gap-2 border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-gray-100' : ''}`}
                >
                  <ComputerDesktopIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-gray-100' : ''}`}
                >
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                </button>
              </div>
              <a
                href={`/${websiteId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
              >
                Preview Website
              </a>
            </div>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <FinalProduct data={websiteData} />
        </div> */}
          <main className={`h-[calc(100vh-3.5rem)] overflow-auto ${
            viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''
          }`}>
          <HeroEdit data={websiteData.hero} onChange={(newData) => handleContentChange('hero', newData)} />    
          </main> 
      </SidebarInset>
      <SectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          section={activeSection}
          data={websiteData[activeSection as keyof typeof websiteData]}
          onChange={(newData) => handleContentChange(activeSection!, newData)}
        />
    </SidebarProvider>
  )
}
'use client'
import { useState } from 'react'
import { PreviewButton } from './PreviewButton'
import { SectionEditor } from './SectionEditor'
import { WebsitePreview } from './WebsitePreview'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline' // Make sure to install @heroicons/react

export default function EditWebsitePage({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [websiteData, setWebsiteData] = useState({
    hero: { heading: '', description: '' },
    menu: [],
    chefs: [],
    about: { content: '' },
    contact: { email: '', phone: '' }
  })

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'menu', label: 'Menu', icon: '🍽️' },
    { id: 'chefs', label: 'Chefs Feed', icon: '👨‍🍳' },
    { id: 'about', label: 'About Us', icon: 'ℹ️' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarCollapsed ? 'w-12' : 'w-80'
        } bg-gray-50 border-r overflow-y-auto transition-all duration-300 relative`}
      >
        {/* Collapse button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-4 bg-white border rounded-full p-1 shadow-sm z-10"
        >
          {isSidebarCollapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>

        <div className={`p-4 ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <h2 className="text-lg font-semibold mb-4">Website Sections</h2>
          <div className="space-y-2">
            {sections.map((section) => (
              <div key={section.id} className="border rounded-lg bg-white">
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{section.icon}</span>
                    <span>{section.label}</span>
                  </span>
                  <span className={`transform transition-transform ${
                    activeSection === section.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                
                {/* Collapsible editor */}
                {activeSection === section.id && (
                  <div className="p-4 border-t">
                    <SectionEditor 
                      section={section.id} 
                      data={websiteData[section.id]}
                      onChange={(newData) => {
                        setWebsiteData(prev => ({
                          ...prev,
                          [section.id]: newData
                        }))
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Collapsed state icons */}
        {isSidebarCollapsed && (
          <div className="py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setIsSidebarCollapsed(false)
                  setActiveSection(section.id)
                }}
                className="w-full p-2 hover:bg-gray-100 flex justify-center"
                title={section.label}
              >
                <span>{section.icon}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview area */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Edit Website</h1>
          <PreviewButton websiteId={params.id} />
        </div>
        <div className="p-4">
          <WebsitePreview data={websiteData} />
        </div>
      </div>
    </div>
  )
}
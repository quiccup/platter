const SECTIONS = [
  { id: 'hero', name: 'Hero Section', icon: '🏠' },
  { id: 'menu', name: 'Menu', icon: '🍽️' },
  { id: 'chefs', name: 'Chefs Feed', icon: '👨‍🍳' },
  { id: 'about', name: 'About Us', icon: 'ℹ️' },
  { id: 'contact', name: 'Contact', icon: '📞' },
]

export function Sidebar({ 
  activeSection, 
  onSectionChange 
}: { 
  activeSection: string
  onSectionChange: (section: string) => void
}) {
  return (
    <div className="p-4">
      <h2 className="font-bold mb-4">Website Sections</h2>
      <nav>
        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left p-3 rounded mb-2 flex items-center ${
              activeSection === section.id ? 'bg-orange-100' : 'hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">{section.icon}</span>
            {section.name}
          </button>
        ))}
      </nav>
    </div>
  )
} 
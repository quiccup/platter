import { useState } from 'react'

interface MenuItem {
  id: string
  name: string
  price: string | number
  image?: string
}

interface PreferenceOption {
  id: string
  name: string
}

interface ChatResponse {
  type: 'menu' | 'keywords'
  question: string
  options: (MenuItem | PreferenceOption)[]
}

const isMenuItem = (option: any): option is MenuItem => {
  return 'price' in option
}

const MenuItemCard = ({ item }: { item: MenuItem }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-colors">
    {item.image && (
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
      <p className="text-orange-500 font-medium">
        ${typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}
      </p>
    </div>
  </div>
)

const KeywordOption = ({ option }: { option: PreferenceOption }) => (
  <div className="px-4 py-2 rounded-full text-sm bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 transition-colors">
    {option.name}
  </div>
)

const FormatJson = ({ content, menuItems = [] }: { content: string; menuItems: any[] }) => {
  try {
    let cleanContent = content.trim()
    
    if (cleanContent.startsWith('{')) {
      try {
        const parsedContent = JSON.parse(cleanContent) as ChatResponse
        
        return (
          <div className="space-y-4">
            <p className="text-gray-800 font-medium mb-4">{parsedContent.question}</p>
            {parsedContent.type === 'menu' ? (
              <div className="grid gap-3 grid-cols-1">
                {parsedContent.options.map((option) => (
                  <div key={option.id}>
                    {isMenuItem(option) && <MenuItemCard item={option} />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {parsedContent.options.map((option) => (
                  <div key={option.id}>
                    {!isMenuItem(option) && <KeywordOption option={option} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      } catch (e) {
        return <div>{content}</div>
      }
    }
    
    return <div>{content}</div>
  } catch (error) {
    console.error('Error formatting JSON:', error)
    return <div>{content}</div>
  }
}

export default FormatJson 
'use client'
import { Mic, MessageSquare, Image as ImageIcon } from 'lucide-react'
import Logo from '@/components/Logo'
import { useState, useRef, useEffect } from 'react'
import FormatJson from './FormatJson'
import { GalleryMarquee } from './Sections/Gallery/GalleryMarquee'
import { ChatInputBar } from './Sections/ChatInputBar'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const FEATURE_CARDS = [
  {
    id: 'fullMenu',
    title: 'Full Menu',
    icon: <Mic className="w-7 h-7 mb-2 md:mb-4 text-blue-700" />
  },
  {
    id: 'aboutUs',
    title: 'About Us',
    icon: <MessageSquare className="w-6 h-6 mb-1 md:mb-2 text-purple-700" />
  },
  {
    id: 'generateImage',
    title: 'Generate image',
    icon: <ImageIcon className="w-6 h-6 mb-1 md:mb-2 text-blue-700" />
  }
]

const RECENT_QUERIES = [
  {
    icon: <MessageSquare className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100',
    text: 'What can I get under 25 dollars?'
  },
  {
    icon: <Mic className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100',
    text: 'What can I get for a table of 5?'
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100',
    text: 'What\'s special here?'
  }
]

export function FinalProduct({ data }: any) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isChatView, setIsChatView] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // Responsive suggestion bubble classes
  const suggestionBubbleClass =
    'flex items-center gap-1 rounded-full px-3 py-1 text-xs bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition whitespace-nowrap ' +
    'md:px-3 md:py-1 md:text-xs ' +
    'sm:px-2 sm:py-0.5 sm:text-[11px]';

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setErrorMessage(null)
    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    try {
      const cleanMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          messages: cleanMessages,
          restaurantData: {
            name: data.navbar?.heading || 'Our Restaurant',
            address: data.navbar?.address,
            menu: data.menu?.items || []
          }
        }),
      })
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`)
      }
      const dataRes = await res.json()
      if (dataRes.error) {
        setErrorMessage('Sorry, there was an error processing your request.')
        console.error('Chat API error:', dataRes.error)
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: dataRes.response }])
      }
    } catch (err) {
      console.error('Chat request failed:', err)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
    setIsChatView(true)
  }

  // Add handler for suggestion click
  const handleSuggestionClick = (text: string) => {
    setInput(text)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full p-3">
      {!isChatView ? (
        <>
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between">
        <div className="w-full mx-auto flex flex-col items-center flex-1">
          <div className="text-md font-bold text-center mb-2 mt-4 md:mt-8">
            Welcome to {data.navbar?.heading || 'our restaurant'}. How may I help you?
          </div>

          {data?.gallery?.images?.length > 0 && (
        <div className="w-full bg-transparent mx-auto mb-6">
          <GalleryMarquee images={data.gallery.images} captions={data.gallery.captions} />
        </div>
      )}
        
    
          {/* Chat History */}
          <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto flex flex-col flex-1 overflow-y-auto" ref={chatContainerRef} style={{ minHeight: 200, maxHeight: 320 }}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-2`}>
                <div className={message.role === 'assistant'
                  ? 'bg-white border border-gray-200 text-black px-4 py-3 rounded-2xl shadow-sm max-w-[80%] text-base'
                  : 'bg-blue-100 text-black px-4 py-3 rounded-2xl max-w-[80%] text-base'}
                  style={{
                    borderBottomRightRadius: message.role === 'user' ? '0.5rem' : '1.5rem',
                    borderBottomLeftRadius: message.role === 'assistant' ? '0.5rem' : '1.5rem',
                  }}
                >
                  {message.role === 'assistant'
                    ? <FormatJson content={message.content} menuItems={data.menu?.items || []} />
                    : message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                Thinking...
              </div>
            )}
            {errorMessage && (
              <div className="text-red-600 text-sm p-2 rounded bg-red-100">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
        {/* Bottom Search Input */}
        <ChatInputBar
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          suggestions={RECENT_QUERIES}
          onSuggestionClick={handleSuggestionClick}
          inputRef={inputRef}
          isLoading={isLoading}
        />
        </div>
        </>
      ) : (
        <div className="h-screen grid grid-rows-[auto_1fr_auto] bg-gray-100 justify-betwee">
          {/* Chat History */}
          <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto flex flex-col flex-1 overflow-y-auto px-2 py-4" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-2`}>
                <div className={message.role === 'assistant'
                  ? 'bg-white border border-gray-200 text-black px-4 py-3 rounded-2xl shadow-sm max-w-[80%] text-base'
                  : 'bg-blue-100 text-black px-4 py-3 rounded-2xl max-w-[80%] text-base'}
                  style={{
                    borderBottomRightRadius: message.role === 'user' ? '0.5rem' : '1.5rem',
                    borderBottomLeftRadius: message.role === 'assistant' ? '0.5rem' : '1.5rem',
                  }}
                >
                  {message.role === 'assistant'
                    ? <FormatJson content={message.content} menuItems={data.menu?.items || []} />
                    : message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                Thinking...
              </div>
            )}
            {errorMessage && (
              <div className="text-red-600 text-sm p-2 rounded bg-red-100">
                {errorMessage}
              </div>
            )}
          </div>
          {/* Bottom Search Input */}
          <ChatInputBar
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            suggestions={RECENT_QUERIES}
            onSuggestionClick={handleSuggestionClick}
            inputRef={inputRef}
            isLoading={isLoading}
            className="px-4 pb-4"
          />
        </div>
      )}
    </div>
  )
} 
'use client'
import { Mic, MessageSquare, Image as ImageIcon, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import FormatJson from './FormatJson'

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
    text: 'Create a personal webpage for me after asking me three questions'
  },
  {
    icon: <Mic className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100',
    text: 'Create a charter to start a local film club'
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100',
    text: 'Write a Python script to automate sending daily email reports'
  }
]

export function FinalProduct({ data }: any) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full h-full p-0">
      {/* Top Section */}
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto flex flex-col items-center flex-1">
        <div className="text-2xl md:text-3xl font-bold text-center mb-2 mt-4 md:mt-8">
          Welcome to {data.navbar?.heading || 'our restaurant'}
        </div>
        <div className="text-lg md:text-xl font-normal text-center mb-6">
          How may I help you?
        </div>
        {/* Feature Cards as Blobs */}
        <div className="w-full grid grid-cols-2 gap-1 md:gap-6 mb-8">
          <button className="col-span-1 row-span-2 rounded-3xl bg-gray-800 text-white flex flex-col items-start justify-end p-2 md:p-6 h-32 md:h-44 shadow-lg min-w-[140px] md:min-w-[200px]">
            {FEATURE_CARDS[0].icon}
            <span className="font-semibold text-base md:text-lg">{FEATURE_CARDS[0].title}</span>
          </button>
          <button className="col-span-1 rounded-3xl bg-purple-200 text-black flex flex-col items-start justify-end p-2 md:p-6 h-14 md:h-20 shadow-lg min-w-[140px] md:min-w-[200px]">
            {FEATURE_CARDS[1].icon}
            <span className="font-semibold text-sm md:text-base">{FEATURE_CARDS[1].title}</span>
          </button>
          <button className="col-span-1 rounded-3xl bg-blue-100 text-black flex flex-col items-start justify-end p-2 md:p-6 h-14 md:h-20 shadow-lg min-w-[140px] md:min-w-[200px]">
            {FEATURE_CARDS[2].icon}
            <span className="font-semibold text-sm md:text-base">{FEATURE_CARDS[2].title}</span>
          </button>
        </div>
        {/* Recent Queries */}
        <div className="w-full mb-8 md:mb-16">
          <div className="text-gray-400 text-sm mb-2">Recent queries</div>
          <div className="flex flex-col gap-3">
            {RECENT_QUERIES.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${q.bg}`}>{q.icon}</div>
                <div className="text-base md:text-lg text-black leading-tight">{q.text}</div>
              </div>
            ))}
          </div>
        </div>
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
      <form className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto sticky bottom-0 z-20" onSubmit={handleSubmit}>
        <div className="flex items-center bg-neutral-100 rounded-full px-8 py-5 md:px-12 md:py-6">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={messages.length === 0 ? `Welcome to ${data.navbar?.heading || 'our restaurant'}, what can I get you started with today?` : 'Type your message...'}
            className="flex-1 bg-transparent text-black placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base border-0 focus:ring-0 focus:outline-none text-base md:text-lg min-h-[2.5rem] md:min-h-[3rem]"
          />
          <button type="submit" className="ml-2 bg-black rounded-full p-2 md:p-3 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>
      </form>
    </div>
  )
} 
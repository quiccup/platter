'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Message, OrderResponse, ChatApiResponse } from '@/types/chat'

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user'
  
    let parsedOrder: OrderResponse | null = null
    if (!isUser) {
      try {
        const parsed = JSON.parse(message.content)
        if (parsed?.type === 'order') {
          parsedOrder = parsed
        }
      } catch {
        // Not JSON, fallback to plain
      }
    }
  
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] p-3 rounded-lg text-sm ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          {parsedOrder ? (
            <div className="space-y-2">
              <p className="font-medium">{parsedOrder.question}</p>
              <ul className="space-y-1 pl-4 list-disc">
                {parsedOrder.menuItems.map((item) => (
                  <li key={item.id} className="text-sm">
                    {item.name} — <span className="font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">{parsedOrder.followUpQuestion}</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    )
}
  

function ChatButton({ onClick }: { onClick: () => void }) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors w-14 h-14 rounded-full flex items-center justify-center border-none cursor-pointer"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    )
}

function ChatWindow({ 
    onClose, 
    messages, 
    input, 
    onInputChange, 
    onSend, 
    isLoading 
  }: { 
    onClose: () => void
    messages: Message[]
    input: string
    onInputChange: (value: string) => void
    onSend: () => void
    isLoading: boolean
  }) {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSend()
      }
    }
  
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-full flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Restaurant Chat</h3>
              <p className="text-xs opacity-90">Ask about our menu!</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm">
                <p>👋 Hi! I can help you with menu recommendations.</p>
              </div>
            )}
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
  
          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about our menu..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={onSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm disabled:bg-gray-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  
export default function ChatbotWidget() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isEmbedded, setIsEmbedded] = useState(false)

  useEffect(() => {
    setMounted(true)
    const embedded = window.parent !== window
    setIsEmbedded(embedded)
  }, [])

  useEffect(() => {
    if (isEmbedded) {
        window.parent.postMessage({ type: 'widget-toggle', isOpen }, '*')
    }
  }, [isOpen, isEmbedded])

  useEffect(() => {
    if (isEmbedded) {
      document.documentElement.style.height = '100%'; // html
      document.body.style.height = '100%';            // body
      document.body.style.margin = '0';               // remove spacing
    }
  }, [isEmbedded])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Get API key from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const apiKey = urlParams.get('api_key') || 'demo_key_123' // fallback to demo

    const userMessage: Message = {
        id: Date.now().toString(),
        content: input.trim(),
        role: 'user',
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
        const response = await fetch('/api/widget-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            apiKey
          }),
        })
    
        const data = await response.json()
        if (data.error) throw new Error(data.error)
    
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
        }
    
        setMessages(prev => [...prev, assistantMessage])
      } catch (error) {
        console.error('Error sending message:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
  }

  return (
    <>
      {!isOpen ? (
        // Circular chat button
        <ChatButton onClick={() => setIsOpen(true)}/>
      ) : (
        <ChatWindow 
        onClose={() => setIsOpen(false)} 
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
        />
      )}
    </>
  )
}
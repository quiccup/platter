'use client'
import { Image as ImageIcon, Mic, Drumstick, MessageSquare, Drum } from 'lucide-react'
import Logo from '@/components/Logo'
import { useState, useRef, useEffect } from 'react'
import FormatJson from './FormatJson'
import { GalleryMarquee } from './Sections/Gallery/GalleryMarquee'
import { ChatInputBar } from './Sections/ChatInputBar'
import AnimatedLogoSpinner from '@/components/AnimatedLogoSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { OrderSummary } from './components/OrderSummary'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatOption {
  id: string
  name: string
}

interface ChatResponse {
  type: 'keywords' | 'order'
  question: string
  options?: ChatOption[]
  menuItems?: {
    id: string
    name: string
    price: string | number
    image?: string
  }[]
  totalPrice?: string | number
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
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
    icon: <span className="inline-block w-2 h-2 rounded-full bg-green-600" />,
    bg: 'bg-white',
    text: 'For a table of 5',
    subtext: 'what can I get?'
  },
  {
    icon: <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />,
    bg: 'bg-white',
    text: 'Build me a combo meal',
    subtext: 'for under 25 dollars'
  },
  {
    icon: <span className="inline-block w-2 h-2 rounded-full bg-pink-500" />,
    bg: 'bg-white',
    text: 'What is famous here',
    subtext: 'at this restaurant?'
  },
  {
    icon: <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />,
    bg: 'bg-white',
    text: 'Suggest a meal',
    subtext: 'for a group of 4'
  }
]

const ChatOrderSummary = ({ content }: { content: string }) => {
  try {
    const parsedContent = JSON.parse(content) as ChatResponse
    if (parsedContent.type === 'order' && parsedContent.menuItems) {
      const orderItems = parsedContent.menuItems.map(item => ({
        id: item.id,
        name: item.name,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price,
        quantity: 1
      }))
      
      const total = typeof parsedContent.totalPrice === 'string' 
        ? parseFloat(parsedContent.totalPrice.replace('$', ''))
        : orderItems.reduce((sum, item) => sum + item.price, 0)

      return (
        <div className="space-y-4">
          <p className="text-gray-800 font-medium mb-4">{parsedContent.question}</p>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="space-y-3">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800">{item.quantity}x {item.name}</span>
                  </div>
                  <span className="text-gray-600">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  } catch (e) {
    return null
  }
}

export function FinalProduct({ data }: any) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isChatView, setIsChatView] = useState(false)
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [orderTotal, setOrderTotal] = useState(0)

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

  console.log(data.menu?.items)

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
        const assistantMessage = { role: 'assistant' as const, content: dataRes.response }
        setMessages(prev => [...prev, assistantMessage])
        try {
          const parsedResponse = JSON.parse(dataRes.response) as ChatResponse
          if (parsedResponse.type === 'keywords' && parsedResponse.options) {
            setCurrentQuestion(parsedResponse.question)
            setCurrentOptions(parsedResponse.options)
            setSelectedOptions([])
          } else if (parsedResponse.type === 'order' && parsedResponse.menuItems) {
            // Clear any existing order
            setOrderItems([])
            setOrderTotal(0)
            
            // Add all items from the order response
            const newItems = parsedResponse.menuItems.map(item => ({
              id: item.id,
              name: item.name,
              price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price,
              quantity: 1
            }))
            
            setOrderItems(newItems)
            const total = newItems.reduce((sum, item) => sum + item.price, 0)
            setOrderTotal(total)
            
            // Clear current options since we're showing the order
            setCurrentOptions([])
            setCurrentQuestion('')
            setSelectedOptions([])
          }
        } catch (e) {
          console.log('Not a JSON response')
        }
      }
    } catch (err) {
      console.error('Chat request failed:', err)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
    setIsChatView(true)
  }

  const handleOptionSelect = (option: ChatOption) => {
    setSelectedOptions(prev => {
      const newSelection = prev.includes(option.id)
        ? prev.filter(id => id !== option.id)
        : [...prev, option.id]
      return newSelection
    })
  }

  const handleDeleteOrderItem = (id: string) => {
    setOrderItems(prev => {
      const item = prev.find(item => item.id === id)
      if (item) {
        setOrderTotal(current => current - (item.price * item.quantity))
      }
      return prev.filter(item => item.id !== id)
    })
  }

  const handleOptionSubmit = async () => {
    if (selectedOptions.length === 0) return

    const selectedNames = selectedOptions
      .map(id => currentOptions.find(opt => opt.id === id)?.name)
      .filter(Boolean)
      .join(', ')

    const userMessage = { 
      role: 'user' as const, 
      content: `${selectedNames}` 
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setCurrentOptions([])
    setCurrentQuestion('')
    setSelectedOptions([])
    setIsChatView(true)

    // Trigger the next chat interaction
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
        const assistantMessage = { role: 'assistant' as const, content: dataRes.response }
        setMessages(prev => [...prev, assistantMessage])
        try {
          const parsedResponse = JSON.parse(dataRes.response) as ChatResponse
          if (parsedResponse.type === 'keywords' && parsedResponse.options) {
            setCurrentQuestion(parsedResponse.question)
            setCurrentOptions(parsedResponse.options)
            setSelectedOptions([])
          } else if (parsedResponse.type === 'order' && parsedResponse.menuItems) {
            // Clear any existing order
            setOrderItems([])
            setOrderTotal(0)
            
            // Add all items from the order response
            const newItems = parsedResponse.menuItems.map(item => ({
              id: item.id,
              name: item.name,
              price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price,
              quantity: 1
            }))
            
            setOrderItems(newItems)
            const total = newItems.reduce((sum, item) => sum + item.price, 0)
            setOrderTotal(total)
            
            // Clear current options since we're showing the order
            setCurrentOptions([])
            setCurrentQuestion('')
            setSelectedOptions([])
          }
        } catch (e) {
          console.log('Not a JSON response')
        }
      }
    } catch (err) {
      console.error('Chat request failed:', err)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Update handler for suggestion click
  const handleSuggestionClick = (text: string) => {
    setInput(text)
    // Create a fake form event and submit immediately
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="min-h-screen p-20 flex flex-col w-full">
      <AnimatePresence mode="wait">
        {!isChatView ? (
          <motion.div
            key="centered-chatbot"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-start justify-start min-h-[60vh] w-full px-20 pt-16"
          >
            <ChatInputBar
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              suggestions={RECENT_QUERIES}
              onSuggestionClick={handleSuggestionClick}
              inputRef={inputRef}
              isLoading={isLoading}
              data={data}
              isChatView={isChatView}
            />
          </motion.div>
        ) : (
          <>
            <OrderSummary 
              items={orderItems} 
              total={orderTotal} 
              onDeleteItem={handleDeleteOrderItem}
            />
            <motion.div
              key="bottom-chatbot"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-[calc(100vh-210px)] flex flex-col bg-white justify-between border border-rounded-l border-gray-200 text-white rounded-lg overflow-hidden"
              style={{ position: 'relative', zIndex: 10 }}
            >
              <div className="flex-1 overflow-y-auto px-[100px] py-6" ref={chatContainerRef}>
                {messages.map((message, index) => (
                  <div key={index} className="flex w-full">
                    <div className={`flex ${message.role === 'assistant' ? 'justify-start w-full' : 'justify-end w-full'} mb-2`}>
                      <div className={message.role === 'assistant'
                        ? 'text-black px-4 py-3 text-base w-full overflow-x-hidden'
                        : 'bg-gray-800 text-white px-4 py-3 rounded-2xl max-w-[80%] text-base ml-auto'}
                        style={{
                          borderTopLeftRadius: message.role === 'user' ? '1.5rem' : '1.5rem',
                          borderTopRightRadius: message.role === 'user' ? '1.5rem' : '1.5rem',
                          borderBottomRightRadius: message.role === 'user' ? '0.5rem' : '1.5rem',
                          borderBottomLeftRadius: message.role === 'assistant' ? '0.5rem' : '1.5rem',
                        }}
                      >
                        {message.role === 'assistant' ? (
                          (() => {
                            try {
                              const parsedContent = JSON.parse(message.content)
                              // Only show the message content if it's not the current options being displayed below
                              if (index === messages.length - 1 && parsedContent.type === 'keywords' && currentOptions.length > 0) {
                                return null
                              }
                              if (parsedContent.type === 'keywords') {
                                return <FormatJson content={message.content} menuItems={data.menu?.items || []} />
                              } else if (parsedContent.type === 'order') {
                                return <ChatOrderSummary content={message.content} />
                              }
                            } catch (e) {
                              return message.content
                            }
                          })()
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {currentOptions.length > 0 && (
                  <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-800 text-lg font-medium mb-4">{currentQuestion}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedOptions.includes(option.id)
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleOptionSubmit}
                      disabled={selectedOptions.length === 0}
                      className={`mt-6 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedOptions.length === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Continue →
                    </button>
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 ml-2">
                    <AnimatedLogoSpinner />
                  </div>
                )}
                {errorMessage && (
                  <div className="text-red-600 text-sm p-2 rounded bg-red-100">
                    {errorMessage}
                  </div>
                )}
              </div>
            </motion.div>
            <div className="px-[100px] py-6 bg-white border-t border-gray-100">
              <ChatInputBar
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                suggestions={RECENT_QUERIES}
                onSuggestionClick={handleSuggestionClick}
                inputRef={inputRef}
                isLoading={isLoading}
                data={data}
                isChatView={isChatView}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 
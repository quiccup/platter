'use client'
import { useParams } from 'next/navigation'
import { Send, Utensils, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FullMenuTab } from './Sections/Menu/Tabs/FullMenuTab'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
  formattedContent?: React.ReactNode
  isTyping?: boolean
}

interface MenuItem {
  id?: string
  title: string
  price: number
  description?: string
  category?: string
  image?: string
}

const FEATURE_CARDS = [
  {
    id: 'fullMenu',
    title: 'Full Menu',
    description: 'Explore our entire menu with detailed descriptions and prices.',
    icon: <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  },
  {
    id: 'aboutUs',
    title: 'About Us',
    description: 'Learn more about our restaurant, our mission, and our team.',
    icon: <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
  },
  {
    id: 'playToWin',
    title: 'Play to Win',
    description: 'Play our interactive games to win rewards and discounts.',
    icon: <svg className="h-6 w-6 text-lime-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M12 4h9" /><path d="M4 9v6a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
  },
  {
    id: 'contactUs',
    title: 'Contact Us',
    description: 'For reservations, inquiries, or feedback, we\'re here to help.',
    icon: <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6v16M4 6a2 2 0 012-2h12a2 2 0 012 2v16M4 6h16" /></svg>
  }
]

export function FinalProduct({ data, sectionOrder = [] }: any) {
  const params = useParams()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to ${data.navbar?.heading || 'our restaurant'}, what can I get you started with today?`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isFirstInteraction, setIsFirstInteraction] = useState(true)

  // Extract restaurant data to send to the API
  const restaurantData = {
    name: data.navbar?.heading || 'Our Restaurant',
    address: data.navbar?.address,
    menu: data.menu?.items || []
  }

  // Handle searching state when input changes
  useEffect(() => {
    if (input.trim()) {
      if (!isSearching) setIsSearching(true)
    } else {
      if (isSearching && messages.length <= 1) setIsSearching(false)
    }
  }, [input, isSearching, messages.length])

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Process AI response to format menu items
  const formatMessageContent = (content: string) => {
    // Check if the message contains item references
    if (content.includes('[item:')) {
      try {
        // Extract item references using a more compatible approach
        const itemRegex = /\[item:(.*?)\]/g;
        const foundItems: MenuItem[] = [];
        const itemTitles: string[] = [];
        
        // Manually extract all matches instead of using matchAll
        let match;
        while ((match = itemRegex.exec(content)) !== null) {
          itemTitles.push(match[1].trim());
        }
        
        if (itemTitles.length > 0) {
          // Find the referenced menu items from our data
          itemTitles.forEach(itemTitle => {
            // Find the item in our menu data
            const menuItem = data.menu?.items.find(
              (item: any) => item.title.toLowerCase() === itemTitle.toLowerCase()
            );
            
            if (menuItem) {
              foundItems.push({
                id: menuItem.id,
                title: menuItem.title,
                price: parseFloat(menuItem.price),
                description: menuItem.description,
                category: menuItem.category,
                image: menuItem.image
              });
            } else {
              // Fallback for items not found in the menu
              foundItems.push({
                title: itemTitle,
                price: 0,
                description: "Item details not available"
              });
            }
          });
          
          // If we found menu items, create a formatted view
          if (foundItems.length > 0) {
            const totalPrice = foundItems.reduce((sum, item) => sum + (item.price), 0);
            
            // Extract introduction (everything before the first item tag)
            const firstItemIndex = content.indexOf('[item:');
            const intro = firstItemIndex > 0 ? content.substring(0, firstItemIndex).trim() : '';
            
            // Extract conclusion (everything after the last item tag)
            const lastItemIndex = content.lastIndexOf(']');
            const conclusion = lastItemIndex < content.length - 1 
              ? content.substring(lastItemIndex + 1).trim() 
              : '';
            
            return (
              <div className="w-full space-y-4 bg-gray-100 p-6 rounded-lg">
                {intro && (
                  <div className="text-gray-800 mb-3">{intro}</div>
                )}
                
                <div className="space-y-3">
                  {foundItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-[#292929] rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="bg-[#c27c36] p-6 flex items-center justify-center min-w-[76px]">
                        <Utensils className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-300">{item.description}</p>
                        )}
                      </div>
                      <div className="pr-6 font-bold text-green-400 text-xl">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 bg-[#292929] rounded-lg overflow-hidden">
                  <div className="p-5 flex justify-between items-center">
                    <span className="text-white font-medium text-xl">Total</span>
                    <span className="text-white font-bold text-2xl">${totalPrice.toFixed(2)}</span>
                  </div>
                  {conclusion && (
                    <div className="p-4 pt-0">
                      <p className="text-gray-300 text-sm">{conclusion}</p>
                    </div>
                  )}
                  <div className="bg-[#1e1e1e] p-4">
                    <p className="text-gray-400 text-sm">Enjoy your meal at {data.navbar?.heading || 'our restaurant'}!</p>
                  </div>
                </div>
              </div>
            );
          }
        }
      } catch (e) {
        console.error('Error formatting message:', e);
      }
    }
    
    // Default case: return the plain text with typing effect
    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  // Process response to format menu items
  const processResponse = (response: string): Message => {
    return {
      role: 'assistant',
      content: response,
      formattedContent: formatMessageContent(response),
      isTyping: true
    };
  };

  // Scroll to bottom of chat when messages change
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
    setIsFirstInteraction(false)

    try {
      // Create a clean version of messages with only role and content
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
          restaurantData
        }),
      })

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`)
      }

      const data = await res.json()
      
      if (data.error) {
        setErrorMessage('Sorry, there was an error processing your request.')
        console.error('Chat API error:', data.error)
      } else {
        // Add the response message with isTyping flag
        const newMessage = processResponse(data.response)
        setMessages(prev => [...prev, newMessage])
        
        // After a short delay, set isTyping to false to indicate typing is complete
        setTimeout(() => {
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === prev.length - 1 ? { ...msg, isTyping: false } : msg
            )
          )
        }, 2000) // Adjust typing effect duration
      }
    } catch (err) {
      console.error('Chat request failed:', err)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key to submit form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  // Handle clicking on suggestion buttons
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Function to render modal content based on activeModal
  const renderModalContent = () => {
    switch (activeModal) {
      case 'fullMenu':
        return <FullMenuTab items={data.menu?.items || []} />
      case 'aboutUs':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">About {data.navbar?.heading || 'Our Restaurant'}</h2>
            <p className="mb-4">
              Welcome to {data.navbar?.heading || 'our restaurant'}, where we pride ourselves on 
              delivering exceptional food and memorable dining experiences.
            </p>
            <p>
              Located at {data.navbar?.address || 'our convenient location'}, we invite you to enjoy 
              our carefully crafted menu items prepared with the freshest ingredients.
            </p>
          </div>
        )
      case 'playToWin':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Play & Win</h2>
            <p className="mb-6">
              Play our interactive games to win exclusive rewards and discounts on your next visit!
            </p>
            <div className="bg-gray-800 p-8 rounded-xl text-white max-w-md mx-auto">
              <p className="text-xl mb-4">Coming Soon!</p>
              <p>Our interactive games are currently in development. Check back soon for a chance to win amazing rewards!</p>
            </div>
          </div>
        )
      case 'contactUs':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Restaurant Information</h3>
                <p className="mb-2"><strong>Address:</strong> {data.navbar?.address || 'Location address'}</p>
                <p className="mb-2"><strong>Phone:</strong> {data.contact?.phone || 'Phone number'}</p>
                <p className="mb-2"><strong>Email:</strong> {data.contact?.email || 'Email address'}</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Hours</h4>
                  <p className="text-sm">Monday - Friday: 9AM - 10PM</p>
                  <p className="text-sm">Saturday: 10AM - 11PM</p>
                  <p className="text-sm">Sunday: 10AM - 9PM</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Send us a message</h3>
                <div className="space-y-4">
                  <Input placeholder="Your Name" className="bg-white dark:bg-gray-800" />
                  <Input placeholder="Your Email" className="bg-white dark:bg-gray-800" />
                  <Input placeholder="Subject" className="bg-white dark:bg-gray-800" />
                  <textarea 
                    placeholder="Your Message" 
                    className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 h-32" 
                  />
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation (shown when searching) */}
      <AnimatePresence>
        {isSearching && !isFirstInteraction && (
          <motion.div 
            className="w-full bg-white shadow-sm"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center space-x-12">
              {FEATURE_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActiveModal(card.id)}
                  className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
                >
                  {card.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <AnimatePresence>
          {(!isSearching || isFirstInteraction) && (
            <motion.div 
              className="w-full max-w-3xl mx-auto text-center pt-20 px-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-3">
                Welcome to {data.navbar?.heading || 'our restaurant'},
              </h1>
              <p className="text-xl font-normal text-gray-800 mb-4">
                what can I get you started with today?
              </p>
              <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
                Ask about our menu, get recommendations, or let us know your preferences!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Cards - Centered when not searching */}
        <AnimatePresence>
          {(!isSearching || isFirstInteraction) && (
            <motion.div 
              className="flex-1 flex items-center justify-center px-4 pb-36 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-6 max-w-3xl w-full">
                {FEATURE_CARDS.map((card, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveModal(card.id)}
                    className="flex flex-col items-center bg-gray-100 rounded-xl p-8 text-left w-full h-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="mb-4">{card.icon}</div>
                    <div className="font-semibold text-gray-900 mb-3 text-center text-lg">{card.title}</div>
                    <div className="text-sm text-gray-500 text-center">{card.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Container */}
        <AnimatePresence>
          {(isSearching || !isFirstInteraction) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 overflow-y-auto"
              ref={chatContainerRef}
            >
              <div className="space-y-6 pb-24">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`rounded-xl px-5 py-3 max-w-[80%] ${
                      message.role === 'assistant'
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {message.isTyping ? (
                        <motion.div 
                          initial={{ filter: "blur(8px)", opacity: 0 }}
                          animate={{ filter: "blur(0px)", opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-base"
                        >
                          {message.content}
                        </motion.div>
                      ) : (
                        message.formattedContent || message.content
                      )}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fixed Input Bar at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white z-10 border-t border-gray-200">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-3 px-6 pt-4 pb-3 overflow-x-auto max-w-5xl mx-auto">
            {[
              "Recommend me combos",
              "I have a budget of $45",
              "Best options for a group of 5",
              "What's your most popular dish?",
              "Any vegetarian options?"
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-full transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          {/* Input Form */}
          <div className="border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 p-3 max-w-5xl mx-auto">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about best combos, budget meals, or anything else"
                className="flex-1 bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none placeholder:text-gray-500 rounded-full py-6 px-6"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className={`bg-green-600 hover:bg-green-700 text-white rounded-full p-3 h-12 w-12 flex items-center justify-center ${!input.trim() ? 'opacity-50' : ''}`}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {FEATURE_CARDS.find(card => card.id === activeModal)?.title}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                {renderModalContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
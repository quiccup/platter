'use client'

import { useState, useEffect, useRef, useCallback, useReducer } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ChatInputBar } from '@/app/dashboard/ChatInputBar'
import AnimatedLogoSpinner from '@/components/AnimatedLogoSpinner'
import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

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

/** --- Types --- **/
interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  type: 'order'
  menuItems?: { id: string; name: string; price: string | number; image?: string }[]
  followUpQuestion?: string
}

interface State {
  messages: Message[]
  input: string
  loading: boolean
  error: string | null
  isChat: boolean
}

interface RestaurantData {
  id: string
  subdomain: string
  restaurant_name: string
  content: any
  is_published: boolean
}

type Action =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SEND_USER'; payload: Message }
  | { type: 'RECEIVE_ASSISTANT'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SHOW_CHAT' }

/** --- Reducer & Hook --- **/
function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload }
    case 'SEND_USER':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'RECEIVE_ASSISTANT':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SHOW_CHAT':
      return { ...state, isChat: true }
    default:
      return state
  }
}

function useChat(data: any) {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    input: '',
    loading: false,
    error: null,
    isChat: false,
  })

  const sendMessage = useCallback(async () => {
    if (!state.input.trim()) return
    dispatch({ type: 'SET_ERROR', payload: null })
    const userMsg: Message = { role: 'user', content: state.input }
    dispatch({ type: 'SEND_USER', payload: userMsg })
    dispatch({ type: 'SET_INPUT', payload: '' })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const history = state.messages.concat(userMsg)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          restaurantData: {
            name: data.navbar?.heading ?? 'Our Restaurant',
            address: data.navbar?.address,
            menu: data.menu?.items ?? [],
          },
        }),
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const { error, response } = await res.json()
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: 'There was an error processing your request.' })
      } else {
        const asstMsg: Message = { role: 'assistant', content: response }
        dispatch({ type: 'RECEIVE_ASSISTANT', payload: asstMsg })
      }
    } catch (e) {
      console.error(e)
      dispatch({ type: 'SET_ERROR', payload: 'Network error. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SHOW_CHAT' })
    }
  }, [state.input, state.messages, data])

  return { state, dispatch, sendMessage }
}

/** --- Sub-components --- **/

const MessageBubble = ({ message }: { message: Message }) => {
  if (message.role === 'user') {
    return <div className="user-bubble">{message.content}</div>
  }
  return <div className="assistant-bubble">{message.content}</div>
}

export default function RestaurantPage() {
  const params = useParams()
  const subdomain = params.subdomain as string
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const chat = useChat(restaurantData?.content || {})
  const { state, sendMessage, dispatch } = chat

  useEffect(() => {
    loadRestaurantData()
  }, [subdomain])

  useEffect(() => {
    const el = chatContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages])

  const loadRestaurantData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Look up restaurant by subdomain
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (userError) {
        if (userError.code === 'PGRST116') {
          setError('Restaurant not found')
        } else {
          setError('Failed to load restaurant data')
        }
        return
      }

      if (!userData) {
        setError('Restaurant not found')
        return
      }

      // Fetch menu items for this user from menu_items table
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('user_id', userData.id) // userData.id is now the auth ID
        .order('created_at', { ascending: false })

      if (menuError) {
        console.error('Error loading menu items:', menuError)
        // Don't fail completely, just log the error
      }

      // Transform menu items to the format expected by the chat
      const formattedMenuItems = (menuItems || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description || '',
        category: 'Menu', // Default category since we don't have categories in menu_items
        image: item.image_url || ''
      }))

      // Create content structure with menu items
      const content = {
        navbar: {
          heading: userData.restaurant_name || 'Restaurant',
          address: userData.content?.navbar?.address || ''
        },
        menu: {
          items: formattedMenuItems
        }
      }

      // If no menu items, add some sample items for testing
      if (formattedMenuItems.length === 0) {
        content.menu.items = [
          { id: '1', name: 'Margherita Pizza', price: 12.99, description: 'Classic tomato and mozzarella', category: 'Pizza', image: '' },
          { id: '2', name: 'Caesar Salad', price: 8.99, description: 'Fresh romaine with caesar dressing', category: 'Salad', image: '' },
          { id: '3', name: 'Chicken Pasta', price: 15.99, description: 'Creamy alfredo with grilled chicken', category: 'Pasta', image: '' },
          { id: '4', name: 'Chocolate Cake', price: 6.99, description: 'Rich chocolate dessert', category: 'Dessert', image: '' }
        ]
      }

      setRestaurantData({
        id: userData.id,
        subdomain: userData.subdomain,
        restaurant_name: userData.restaurant_name || 'Restaurant',
        content: content,
        is_published: userData.is_published
      })
    } catch (err) {
      console.error('Error loading restaurant:', err)
      setError('Failed to load restaurant data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      sendMessage()
    },
    [sendMessage]
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    )
  }

  if (error || !restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The restaurant you\'re looking for doesn\'t exist or isn\'t published yet.'}
          </p>
          <p className="text-sm text-gray-500">
            Subdomain: {subdomain}
          </p>
        </div>
      </div>
    )
  }

  const inputBarProps = {
    input: state.input,
    setInput: (val: string) => dispatch({ type: 'SET_INPUT', payload: val }),
    suggestions: RECENT_QUERIES,
    onSuggestionClick: (text: string) => {
      dispatch({ type: 'SET_INPUT', payload: text })
      sendMessage()
    },
    inputRef: inputRef,
    isLoading: state.loading,
    data: restaurantData.content,
  }

  return (
    <div className=" p-5">
      
      <AnimatePresence mode="wait">
        {!state.isChat ? (
          <ChatInputBar
            {...inputBarProps}
            onSubmit={handleSubmit}
            isChatView={state.isChat}
          />
        ) : (
          <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
              {state.messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
              {state.loading && <AnimatedLogoSpinner />}
              {state.error && <div className="error-banner">{state.error}</div>}
            </div>
            <ChatInputBar
              {...inputBarProps}
              onSubmit={handleSubmit}
              isChatView={state.isChat}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// FinalProduct.tsx
'use client'

import { useState, useRef, useEffect, useCallback, useReducer } from 'react'
import AnimatedLogoSpinner from '@/components/AnimatedLogoSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatInputBar } from './Sections/ChatInputBar'
import { OrderSummary } from './components/OrderSummary'
import { RestaurantInfo } from './types'

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

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface State {
  messages: Message[]
  input: string
  loading: boolean
  error: string | null
  isChat: boolean
  orderItems: OrderItem[]
  orderTotal: number
}

export interface MenuItem {
  id: string
  name: string
  price: number | string
  image?: string
}

interface FinalProductProps {
  data: RestaurantInfo
}

type Action =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SEND_USER'; payload: Message }
  | { type: 'RECEIVE_ASSISTANT'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDER'; payload: OrderItem[] }
  | { type: 'DELETE_ORDER_ITEM'; payload: string }
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
    case 'SET_ORDER': {
      const allItems = [...state.orderItems, ...action.payload]

      const grouped: Record<string, OrderItem> = {}
      allItems.forEach(item => {
        const key = item.id
        if (grouped[key]) {
          grouped[key].quantity += item.quantity
        } else {
          grouped[key] = { ...item }
        }
      })

      const merged = Object.values(grouped)
      const total = merged.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { ...state, orderItems: merged, orderTotal: total }
    }
    case 'DELETE_ORDER_ITEM': {
      const filtered = state.orderItems.filter(i => i.id !== action.payload)
      const newTotal = filtered.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { ...state, orderItems: filtered, orderTotal: newTotal }
    }
    case 'SHOW_CHAT':
      return { ...state, isChat: true }
    default:
      return state
  }
}

function useChat(data: data) {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    input: '',
    loading: false,
    error: null,
    isChat: false,
    orderItems: [],
    orderTotal: 0,
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
            id: data.id,
            name: data.name,
            menu: data.menuItems
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
        try {
          const parsed = JSON.parse(response) as ChatResponse
          if (parsed.type === 'order' && parsed.menuItems) {
            const items: OrderItem[] = parsed.menuItems.map(i => ({
              id: i.id,
              name: i.name,
              price: typeof i.price === 'string' ? parseFloat(i.price.replace('$', '')) : i.price,
              quantity: 1,
            }))
            dispatch({ type: 'SET_ORDER', payload: items })
          }
        } catch {}
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
const ChatOrderSummary = ({ content }: { content: string }) => {
  try {
    const parsed = JSON.parse(content) as ChatResponse
    if (parsed.type !== 'order' || !parsed.menuItems) return null

    // Merge duplicates into one entry with quantity > 1
    const grouped: Record<string, OrderItem> = {}

    parsed.menuItems.forEach(i => {
      // normalize price to number
      const price =
        typeof i.price === 'string'
          ? parseFloat(i.price.replace('$', ''))
          : i.price

      if (grouped[i.id]) {
        grouped[i.id].quantity += 1
      } else {
        grouped[i.id] = {
          id: i.id,
          name: i.name,
          price,
          quantity: 1,
        }
      }
    })

    const items = Object.values(grouped)
    const total = items.reduce((sum, x) => sum + x.price * x.quantity, 0)

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.quantity}× {item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-medium">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {parsed.followUpQuestion && (
          <div className="mt-4 text-blue-700 font-medium">
            {parsed.followUpQuestion}
          </div>
        )}
      </div>
    )
  } catch {
    return null
  }
}

const MessageBubble = ({ message }: { message: Message }) => {
  if (message.role === 'user') {
    return <div className="user-bubble">{message.content}</div>
  }
  try {
    const parsed = JSON.parse(message.content) as ChatResponse
    if (parsed.type === 'order') {
      return <ChatOrderSummary content={message.content} />
    }
  } catch {}
  return <div className="assistant-bubble">{message.content}</div>
}

/** --- FinalProduct (glues it all together) --- **/
export function FinalProduct({ data }: { data: RestaurantInfo }) {
  const { state, dispatch, sendMessage } = useChat(data)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Memoize your submit handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      sendMessage()
    },
    [sendMessage]
  )

  useEffect(() => {
    const el = chatContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages])

  const inputBarProps = {
    input: state.input,
    setInput: (val: string) => dispatch({ type: 'SET_INPUT', payload: val }),
    suggestions: RECENT_QUERIES,
    onSuggestionClick: (text: string) => {
      dispatch({ type: 'SET_INPUT', payload: text })
      sendMessage()
    },
    inputRef: inputRef,
    isLoading:  state.loading,
    data: data,
  }

  return (
    <div className="min-h-screen p-20 flex flex-col w-full">
      <AnimatePresence mode="wait">
        {!state.isChat ? (
          <ChatInputBar
            {...inputBarProps}
            onSubmit={handleSubmit}
            isChatView={state.isChat}
          />
        ) : (
          <>
            <OrderSummary
              items={state.orderItems}
              total={state.orderTotal}
              onDeleteItem={id => dispatch({ type: 'DELETE_ORDER_ITEM', payload: id })}
            />
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
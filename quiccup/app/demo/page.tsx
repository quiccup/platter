'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'

type DemoMessage = {
  id: number
  sender: 'bot' | 'user'
  text: string
  items?: Array<{ name: string; description: string; price: string }>
  paymentOptions?: string[]
  orderSummary?: {
    items: Array<{ name: string; price: string }>
    total: string
  }
}

const demoMessages: DemoMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: "Welcome to Resteros! I'm Platter, your AI host. I'm here to get your order started while you settle in. What are you in the mood for tonight?"
  },
  {
    id: 2,
    sender: 'user',
    text: "I'm craving something seafood-forward, maybe with a little heat."
  },
  {
    id: 3,
    sender: 'bot',
    text: 'Great choice. Our Citrus Chile Salmon comes with charred broccolini and pineapple salsa for $24. Guests love pairing it with our jalapeño-mango margarita or garlic-parmesan fries.'
  },
  {
    id: 4,
    sender: 'user',
    text: "Hmm, I'm not sure—do you have anything else in mind?"
  },
  {
    id: 5,
    sender: 'bot',
    text: "Absolutely. If you’d like something richer, the fire-roasted shrimp pasta has a Calabrian chili cream sauce that brings the heat and it’s $21. I can also build you a duet plate with half shrimp pasta and half salmon so you don't have to choose—plus a side of citrus slaw to keep things bright."
  },
  {
    id: 6,
    sender: 'user',
    text: "A duet plate sounds perfect. What sides or add-ons do people usually take with that?"
  },
  {
    id: 7,
    sender: 'bot',
    text: 'The truffle lobster mac is the fan favorite—it turns the duet into a signature combo. I can knock $4 off if we bundle the lobster mac with your duet, and most guests follow it with our burnt honey cheesecake for something light and sweet.'
  },
  {
    id: 8,
    sender: 'user',
    text: "Alright, let's go with the duet, lobster mac, and that cheesecake. Anything I shouldn't miss for a drink?"
  },
  {
    id: 9,
    sender: 'bot',
    text: 'The spicy guava spritz cools off the heat while keeping the tropical vibe. Want me to add one for $9? I can always remove it before checkout if you change your mind.',
    items: [
      {
        name: 'Spicy Guava Spritz',
        description: 'Tequila, guava nectar, chili salt rim',
        price: '$9.00'
      }
    ]
  },
  {
    id: 10,
    sender: 'user',
    text: 'Sure, add the spritz too.'
  },
  {
    id: 11,
    sender: 'bot',
    text: 'Perfect. Here’s the plan—let me know if you want anything tweaked.',
    orderSummary: {
      items: [
        { name: 'Salmon + Shrimp Duet Plate', price: '$26.00' },
        { name: 'Truffle Lobster Mac (bundle pricing)', price: '$12.00' },
        { name: 'Burnt Honey Cheesecake', price: '$8.00' },
        { name: 'Spicy Guava Spritz', price: '$9.00' }
      ],
      total: '$55.00'
    }
  },
  {
    id: 12,
    sender: 'bot',
    text: 'Does that look right? I can send it to the kitchen as soon as you pick a payment option.',
    paymentOptions: ['Apple Pay', 'Google Pay', 'Card on File']
  },
  {
    id: 13,
    sender: 'user',
    text: "Apple Pay works for me."
  },
  {
    id: 14,
    sender: 'bot',
    text: 'Got it. I’ve charged Apple Pay ending in •••• 21. Your order is in the kitchen and should hit the table in about 12 minutes. Enjoy!'
  }
]

const workflowStages = [
  {
    title: 'Tap the Widget',
    description: 'Guest opens Platter from the restaurant site, QR, or kiosk.',
    triggerIndex: 1
  },
  {
    title: 'Personalize the Order',
    description: 'Platter learns intent and builds a tailored bundle with upsells.',
    triggerIndex: 4
  },
  {
    title: 'Confirm & Pay',
    description: 'We recap the cart, handle objections, and capture payment in-chat.',
    triggerIndex: 10
  },
  {
    title: 'Fire to Kitchen',
    description: 'The POS gets the ticket instantly—no staff juggling required.',
    triggerIndex: 12
  }
]

const messageDelayMs = 2200

const DemoPage = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const startDemo = () => {
    setIsWidgetOpen(true)
    setVisibleCount(0)
    setIsPlaying(true)
  }

  const resetDemo = () => {
    setIsWidgetOpen(false)
    setVisibleCount(0)
    setIsPlaying(false)
  }

  useEffect(() => {
    if (!isPlaying) return

    if (visibleCount >= demoMessages.length) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1)
    }, messageDelayMs)

    return () => clearTimeout(timer)
  }, [isPlaying, visibleCount])

  useEffect(() => {
    if (!chatContainerRef.current) return
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [visibleCount])

  const activeStageIndex = useMemo(() => {
    for (let i = workflowStages.length - 1; i >= 0; i--) {
      if (visibleCount >= workflowStages[i].triggerIndex) {
        return i
      }
    }
    return -1
  }, [visibleCount])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="font-display text-2xl text-slate-900">Platter Demo</span>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-white"
              onClick={resetDemo}
            >
              Reset
            </button>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              onClick={startDemo}
            >
              Play Conversation
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="mb-12 max-w-3xl">
          <h1 className="font-display text-4xl text-slate-900">How Platter Upsells in Real Time</h1>
          <p className="mt-4 text-lg text-slate-600">
            This scripted walkthrough shows the end-to-end guest journey. Click &ldquo;Play Conversation&rdquo; and watch Platter
            greet the guest, learn their intent, bundle high-margin dishes, capture payment, and fire the ticket—without a
            server touching the table.
          </p>
        </section>

        <section className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {workflowStages.map((stage, index) => {
            const isActive = activeStageIndex === index
            const isComplete = activeStageIndex > index

            return (
              <div
                key={stage.title}
                className={cn(
                  'rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition',
                  isActive && 'border-blue-500 shadow-md shadow-blue-100',
                  isComplete && 'border-emerald-400'
                )}
              >
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
                  <span>Step {index + 1}</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-[2px] text-xs',
                      isComplete ? 'bg-emerald-100 text-emerald-700' : isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {isComplete ? 'Complete' : isActive ? 'In Progress' : 'Queued'}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{stage.description}</p>
              </div>
            )
          })}
        </section>
      </main>

      <FloatingChatWidget
        isWidgetOpen={isWidgetOpen}
        isPlaying={isPlaying}
        visibleCount={visibleCount}
        chatContainerRef={chatContainerRef}
        onToggle={() => {
          if (isPlaying) return
          setIsWidgetOpen((prev) => !prev)
        }}
      />
    </div>
  )
}

type FloatingChatWidgetProps = {
  isWidgetOpen: boolean
  isPlaying: boolean
  visibleCount: number
  chatContainerRef: React.RefObject<HTMLDivElement>
  onToggle: () => void
}

const FloatingChatWidget = ({
  isWidgetOpen,
  isPlaying,
  visibleCount,
  chatContainerRef,
  onToggle
}: FloatingChatWidgetProps) => {
  return (
    <>
      <div
        className={cn(
          'fixed bottom-24 right-6 w-full max-w-sm rounded-3xl border border-slate-200 bg-white shadow-2xl transition duration-500',
          isWidgetOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        )}
      >
        <div className="flex items-center justify-between rounded-t-3xl bg-slate-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-6 text-white" />
            <div>
              <p className="text-sm font-semibold text-white">Resteros</p>
              <p className="text-xs text-slate-300">Powered by Platter</p>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="space-y-4 px-5 py-6">
          <div ref={chatContainerRef} className="max-h-[460px] space-y-4 overflow-y-auto pr-1">
            {demoMessages.slice(0, visibleCount).map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isPlaying && visibleCount < demoMessages.length && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500 shadow-sm">typing…</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className={cn(
          'fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-lg transition hover:border-slate-400 hover:bg-slate-50',
          isWidgetOpen && 'border-blue-400 text-blue-600'
        )}
        onClick={onToggle}
      >
        {isWidgetOpen ? 'Hide Widget' : 'Preview Widget'}
      </button>
    </>
  )
}

const ChatBubble = ({ message }: { message: DemoMessage }) => {
  const isBot = message.sender === 'bot'

  return (
    <div className={cn('flex w-full', isBot ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
          isBot ? 'bg-slate-100 text-slate-800' : 'bg-blue-600 text-white'
        )}
      >
        <p>{message.text}</p>

        {message.items && (
          <div className="mt-3 space-y-2">
            {message.items.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {message.orderSummary && (
          <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order Summary</p>
            <div className="space-y-3 text-sm">
              {message.orderSummary.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                    {item.name}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-semibold">
              <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                Total
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                {message.orderSummary.total}
              </span>
            </div>
          </div>
        )}

        {message.paymentOptions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.paymentOptions.map((option) => (
              <span
                key={option}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
              >
                {option}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DemoPage


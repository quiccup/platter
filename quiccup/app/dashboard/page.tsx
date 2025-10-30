'use client'

// Widget-first MVP dashboard. Previous comprehensive dashboard UI is intentionally
// removed for now and can be restored from git history.

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Button } from "@/components/ui/button"
import { MenuEditor } from './components/MenuEditor'

export default function DashboardPage() {
	const { user } = useAuth()

	// Chatbot state
	const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return
		const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input.trim() }
		setMessages(prev => [...prev, userMessage])
		setInput('')
		setIsLoading(true)
		try {
			const res = await fetch('/api/widget-chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
					apiKey: 'demo_key_123',
				}),
			})
			const data = await res.json()
			const assistant = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: data.response || '...' }
			setMessages(prev => [...prev, assistant])
		} catch (e) {
			setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, something went wrong.' }])
    } finally {
			setIsLoading(false)
		}
	}

    return (
      <div className="min-h-screen bg-gray-50">
			<main className="container mx-auto px-6 py-8 space-y-10">
				{/* Chatbot Card */}
				<section className="mx-auto max-w-3xl">
					<div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
						<div className="bg-blue-600 text-white px-6 py-4">
							<h2 className="text-lg font-semibold">Platter Chatbot</h2>
							<p className="text-xs opacity-90">Ask about dishes, ingredients, and recommendations</p>
						</div>

						<div className="p-6">
							<div className="h-80 overflow-y-auto space-y-4">
								{messages.length === 0 && (
									<div className="text-center text-slate-500 text-sm pt-10">Say hi and ask for a recommendation!</div>
								)}
								{messages.map(m => (
									<div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
										<div className={
											'max-w-[75%] rounded-2xl px-4 py-2 text-sm ' +
											(m.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-900 rounded-bl-sm')
										}>
											{m.content}
        </div>
      </div>
								))}
          </div>
        
							<div className="mt-4 flex gap-2">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
									placeholder="Type your message..."
									className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<Button onClick={sendMessage} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
									{isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
				</section>

				{/* Menu Editor */}
				<section className="mx-auto max-w-5xl">
					<h3 className="text-lg font-semibold text-slate-900 mb-3">Menu</h3>
					{user?.id ? (
						<MenuEditor userId={user.id} />
					) : (
						<div className="bg-white border border-slate-200 rounded-lg p-6 text-sm text-slate-500">
							Please sign in to edit your menu.
            </div>
					)}
				</section>
      </main>
    </div>
  )
}
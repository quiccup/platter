'use client'

import { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { Copy } from 'lucide-react'

export function ApiKeyEdit({ userId }: { userId: string }) {
    const [apiKey, setApiKey] = useState<string>('')
    const [loading, setLoading]  = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [isHovering, setIsHovering] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        loadApiKey()
    }, [userId])

    const loadApiKey = async () => {
        try {
            const { data } = await supabase
              .from('users')
              .select('api_key')
              .eq('id', userId)
              .single()
            setApiKey(data?.api_key || '')
          } catch (error) {
            console.error('Error loading API key:', error)
          } finally {
            setInitialLoading(false)
          }
    }

    const generateApiKey = async () => {
        setLoading(true)
        // TODO: Implement proper key generation
        const newKey = 'pk_live_' + Math.random().toString(36).substr(2, 32)
        try {
            const { error } = await supabase
              .from('users')
              .update({ api_key: newKey })
              .eq('id', userId)
            
            if (!error) {
              setApiKey(newKey)
            }
        } catch (error) {
            console.error('Error generating API key:', error)
        } finally {
            setLoading(false)
        }
    }

    const copyApiKey = async () => {
        try {
            await navigator.clipboard.writeText(apiKey)
            // You could add a toast notification here
        } catch (error) {
            console.error('Failed to copy API key:', error)
        }
    }

    if (initialLoading) {
        return <div>Loading...</div>
    }
    return (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Key Management</h3>
            
            <div className="space-y-4">
              {apiKey ? (
                <div className="space-y-3">
                  <div 
                    className="relative p-3 bg-gray-100 rounded-md font-mono text-sm break-all group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {apiKey}
                    {isHovering && (
                      <div 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-200 rounded p-1 transition-colors"
                        onClick={copyApiKey}
                        title="Click to copy API key"
                      >
                        <Copy className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={generateApiKey}
                    disabled={loading}
                    className="bg-white text-black px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate New Key'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">You don't have an API key yet.</p>
                  <button
                    onClick={generateApiKey}
                    disabled={loading}
                    className="bg-white text-black px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate API Key'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    )
}
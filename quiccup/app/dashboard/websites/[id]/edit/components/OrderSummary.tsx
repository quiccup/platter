'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, X, Trash2 } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  total: number
  onDeleteItem: (id: string) => void
}

export function OrderSummary({ items, total, onDeleteItem }: OrderSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="w-80 self-end mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">My Order</h3>
          {itemCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {itemCount}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              {items.length === 0 ? (
                <p className="text-gray-500">No items added yet</p>
              ) : (
                <>
                  <div className="space-y-2 mb-3">
                    {items.map(item => (
                      <motion.div 
                        key={item.id} 
                        className="flex items-center justify-between group"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
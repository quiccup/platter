"use client"

import { motion } from 'framer-motion'
import { usePreviewTheme } from '@/components/preview-theme-provider'

export function PartyOrdersTab() {
  const { theme } = usePreviewTheme()
  
  return (
    <motion.div
      key="party-orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Party orders content */}
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
        <p>Our party orders feature is currently under development.</p>
      </div>
    </motion.div>
  )
} 
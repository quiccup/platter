'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface AboutDisplayProps {
  isOpen: boolean
  onClose: () => void
  content: string
}

export function AboutDisplay({ isOpen, onClose, content }: AboutDisplayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
              w-[90vw] max-w-2xl bg-white rounded-3xl p-8 z-50 shadow-xl"
          >
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                {content || "Add your restaurant's story"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

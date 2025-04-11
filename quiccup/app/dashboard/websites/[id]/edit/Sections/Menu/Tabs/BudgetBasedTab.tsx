"use client"

import { useState, useEffect } from 'react'
import { usePreviewTheme } from '@/components/preview-theme-provider'
import { MenuItem } from '../../../types'
import { ArrowRight, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

interface BudgetComboItem {
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface BudgetCombo {
  items: BudgetComboItem[];
  total: number;
  comment: string;
}

interface BudgetCombos {
  [key: string]: BudgetCombo[];
}

interface BudgetBasedTabProps {
  menuItems: MenuItem[]
  websiteId: string
  budgetCombos?: BudgetCombos
}

export function BudgetBasedTab({ menuItems, websiteId, budgetCombos }: BudgetBasedTabProps) {
  const { theme } = usePreviewTheme()
  const [inputValue, setInputValue] = useState<string>('30')
  const [budget, setBudget] = useState<number>(30)
  const [selectedCombos, setSelectedCombos] = useState<BudgetCombo[]>([])

  useEffect(() => {
    if (!budgetCombos) return

    // Get all available combinations with their totals
    const allCombos = Object.keys(budgetCombos)
      .flatMap(key => budgetCombos[key])
      .filter(combo => combo.total <= budget) // Filter combos within budget
      .sort((a, b) => b.total - a.total) // Sort by price descending

    // Take only the top 3 closest to budget
    const topThreeCombos = allCombos.slice(0, 3)

    setSelectedCombos(topThreeCombos)
  }, [budget, budgetCombos])

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newBudget = Number(inputValue)
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Heading */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-black dark:text-white">
          Find the Perfect Combo
        </h2>
      </motion.div>

      {/* Updated Budget input form */}
      <form onSubmit={handleBudgetSubmit} className="relative">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative flex-1">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black dark:text-white w-5 h-5" />
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter budget"
              className={`
                w-full pl-12 pr-4 h-14 text-lg
                bg-white dark:bg-black
                text-black dark:text-white
                placeholder:text-gray-400
                border-2 border-black dark:border-white
                rounded-xl
                focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20
              `}
            />
          </div>
          
          <button
            type="submit"
            className="h-14 w-14 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <ArrowRight className="w-6 h-6 text-white dark:text-black" />
          </button>
        </motion.div>
      </form>

      {/* Updated Results section */}
      <div className="space-y-6">
        {selectedCombos.map((combo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Items row with capsules */}
              <div className="flex flex-wrap gap-2">
                {combo.items.map((item, itemIndex) => {
                  const menuItem = menuItems.find(mi => mi.title === item.name)
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 dark:bg-gray-800 shadow-sm"
                    >
                      {menuItem?.image && (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                          <img
                            src={menuItem.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Total and Comment */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${combo.total.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {combo.comment}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {selectedCombos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] text-center"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                No combinations found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try increasing your budget or check our menu for individual items.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 
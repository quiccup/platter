'use client'

import { MenuItem } from '@/lib/services/menuService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye } from 'lucide-react'

interface MenuItemsTableProps {
  items: MenuItem[]
  onEdit?: (item: MenuItem) => void
  onDelete?: (itemId: string) => void
  onView?: (item: MenuItem) => void
}

export function MenuItemsTable({ items, onEdit, onDelete, onView }: MenuItemsTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No menu items yet. Add your first item above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Price</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Description</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Tags</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Created</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {formatPrice(item.price)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {item.description || 'No description'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {item.tags && item.tags.length > 0 ? (
                      item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No tags</span>
                    )}
                    {item.tags && item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(item)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id!)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

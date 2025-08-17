'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/uploadImage"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createWorker } from 'tesseract.js'
import { MenuItemsModal } from './MenuItemsModal'
import { ListPlus, Upload, Trash2, PlusCircle, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client'

interface MenuItem {
  title: string
  description: string
  price: string
  image?: string
  category?: string
  tags: string[]
}

interface MenuEditorProps {
  data: {
    items: MenuItem[]
  }
  onChange: (data: any) => void
  websiteId: string
}

export function MenuEditor({ data, onChange, websiteId }: MenuEditorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrStatus, setOcrStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [showJsonImporter, setShowJsonImporter] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuItemsModalOpen, setMenuItemsModalOpen] = useState(false)

  const processImage = async (file: File) => {
    setOcrStatus('Processing...')
    const worker = await createWorker('eng', 1, {
      logger: m => console.log(m),
    })

    try {
      const { data: { text } } = await worker.recognize(file)
      setOcrStatus('Extracting menu items...')

      // Parse the text into menu items
      const lines = text.split('\n').filter(line => line.trim())
      const items: MenuItem[] = []
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // Look for lines that have prices (e.g., $12.99)
        const priceMatch = line.match(/\$\d+(\.\d{2})?/)
        if (priceMatch) {
          const price = priceMatch[0]
          const title = line.substring(0, line.indexOf(price)).trim()
          const description = lines[i + 1]?.trim() || ''
          
          if (title) {
            items.push({
              title,
              description,
              price,
              category: 'Main',
              tags: []
            })
            i++ // Skip the description line
          }
        }
      }

      setOcrStatus('Completed')
      return items
    } catch (error) {
      console.error('Error processing image:', error)
      setOcrStatus('Error occurred during processing')
      return []
    } finally {
      await worker.terminate()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsProcessing(true)
      const imageUrl = await uploadImage(file, 'menus')
      const items = await processImage(file)
      
      // Add the image URL to all items
      const itemsWithImage = items.map(item => ({
        ...item,
        image: imageUrl
      }))
      
      onChange({ ...data, items: itemsWithImage })
    } catch (error) {
      console.error('Error processing menu image:', error)
    } finally {
      setIsProcessing(false)
      setOcrStatus('')
    }
  }

  const processCSV = async (file: File) => {
    setIsProcessing(true)
    try {
      const text = await file.text()
      const rows = text.split('\n').map(row => row.split(','))
      
      // Process items without AI first
      const items = rows.slice(1).map(row => ({
        title: row[0]?.trim() || '',
        description: row[1]?.trim() || '',
        price: row[2]?.trim() || '',
        category: row[3]?.trim() || 'Main',
        image: '',
        tags: []
      }))

      // Update with initial items
      onChange({ ...data, items })

      // Then enhance descriptions with AI one at a time
      for (const item of items) {
        if (!item.description) {
          // Skip AI enhancement for now since we're not using it
          // const result = await processImage(item.image || '')
          // if (result.length > 0) {
          //   item.description = result[0].description
          //   onChange({ ...data, items: [...items] })
          // }
          // Add delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      console.error('Error processing menu:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Process JSON menu items
  const processJsonMenuItems = () => {
    try {
      setJsonError(null)
      const menuData = JSON.parse(jsonInput)
      
      const newMenuItems: MenuItem[] = []
      
      // Process each category
      Object.entries(menuData).forEach(([category, items]: [string, any]) => {
        // Skip if not an array
        if (!Array.isArray(items)) return
        
        // Process each item in the category
        items.forEach((item: any) => {
          if (!item.name || !item.price) return
          
          let description = item.description || ''
          
          // Add serves info to description if available
          if (item.serves) {
            description += description ? ` (Serves ${item.serves})` : `Serves ${item.serves}`
          }
          
          newMenuItems.push({
            title: item.name,
            description,
            price: typeof item.price === 'number' ? item.price.toString() : item.price,
            tags: [category],
            image: ''
          })
        })
      })
      
      // If successfully parsed items, add them to the menu
      if (newMenuItems.length > 0) {
        const updatedItems = [...data.items, ...newMenuItems]
        onChange({ ...data, items: updatedItems })
        setShowJsonImporter(false)
        setJsonInput('')
      } else {
        setJsonError('No valid menu items found in the JSON')
      }
    } catch (error) {
      console.error('Error parsing JSON:', error)
      setJsonError('Invalid JSON format. Please check your input.')
    }
  }

  const regenerateAiRecommendations = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/generate-menu-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: websiteId,
          menuItems: data.items
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate menu recommendations')
      }
      
      toast.success('Menu recommendations updated!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update menu recommendations')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Menu Editor</h3>
        <Button 
          onClick={regenerateAiRecommendations}
          disabled={isGenerating}
          variant="outline"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Regenerate AI Recommendations'
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMenuItemsModalOpen(true)}>
            <ListPlus className="h-4 w-4 mr-2" />
            Add Items
          </Button>
          <Button variant="outline" onClick={() => setShowJsonImporter(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
        </div>

        {/* Existing menu items list */}
        <div className="space-y-4">
          {data?.items?.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.price}</p>
                </div>
                {/* Add edit/delete buttons for individual items */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Import Modal */}
      <Dialog open={showJsonImporter} onOpenChange={setShowJsonImporter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Menu from JSON</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your JSON menu data here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={10}
            />
            {jsonError && (
              <p className="text-red-500 text-sm">{jsonError}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={processJsonMenuItems}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Items Modal */}
      <MenuItemsModal 
        open={menuItemsModalOpen}
        onOpenChange={setMenuItemsModalOpen}
        items={data?.items || []}
        onItemsChange={(items) => onChange({ ...data, items })}
      />
    </div>
  )
}

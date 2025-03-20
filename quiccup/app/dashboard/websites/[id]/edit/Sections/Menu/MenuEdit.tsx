import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/uploadImage"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createWorker } from 'tesseract.js'
import { MenuItemsModal } from './MenuItemsModal'
import { ListPlus, Upload, Trash2, PlusCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

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
}

export function MenuEditor({ data, onChange }: MenuEditorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrStatus, setOcrStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [showJsonImporter, setShowJsonImporter] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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
          const result = await processImage(item.image || '')
          if (result.length > 0) {
            item.description = result[0].description
            onChange({ ...data, items: [...items] })
          }
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
          websiteId,
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
    <div className="space-y-4">
      <div className="flex">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJsonImporter(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
          <Button onClick={() => setModalOpen(true)} variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>
      
      {/* JSON Import Dialog */}
      <Dialog open={showJsonImporter} onOpenChange={setShowJsonImporter}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Menu Items from JSON</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <Label htmlFor="json-input">Paste your menu JSON below</Label>
            <Textarea 
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"Category": [{"name": "Item name", "description": "Item description", "price": 10.99}]}'
              rows={12}
              className="font-mono text-sm"
            />
            
            {jsonError && (
              <p className="text-destructive text-sm">{jsonError}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJsonImporter(false)}>
              Cancel
            </Button>
            <Button onClick={processJsonMenuItems}>
              Add Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MenuItemsModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        items={data.items || []}
        onItemsChange={(items) => onChange({ ...data, items })}
      />

      <Button 
        onClick={regenerateAiRecommendations} 
        disabled={isGenerating}
        variant="outline"
      >
        {isGenerating ? 'Updating AI Recommendations...' : 'Update AI Recommendations'}
      </Button>
    </div>
  )
}

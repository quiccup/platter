import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/uploadImage"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createWorker } from 'tesseract.js'
import { MenuItemsModal } from './MenuItemsModal'
import { ListPlus } from 'lucide-react'

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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setModalOpen(true)}
          variant="outline"
        >
          <ListPlus className="w-4 h-4 mr-2" />
          Add Menu Items
        </Button>
      </div>

      <MenuItemsModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        items={data.items || []}
        onItemsChange={(items) => onChange({ ...data, items })}
      />

  
    </div>
  )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload, FileSpreadsheet, X, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { uploadImage } from "@/lib/uploadImage"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MenuItem } from '../../types'

interface MenuItemsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: MenuItem[]
  onItemsChange: (items: MenuItem[]) => void
}

export function MenuItemsModal({ open, onOpenChange, items, onItemsChange }: MenuItemsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [localItems, setLocalItems] = useState(items)
  const [availableTags] = useState<string[]>([
    // Courses
    'Appetizer',
    'Starter',
    'Main Course',
    'Entrée',
    'Dessert',
    'Side Dish',
    'Soup',
    'Salad',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Brunch',

    // Dietary Restrictions
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Dairy Free',
    'Nut Free',
    'Halal',
    'Kosher',
    'Keto',
    'Low Carb',
    'Low Fat',
    'Sugar Free',
    'Paleo',

    // Allergen Information
    'Contains Nuts',
    'Contains Dairy',
    'Contains Eggs',
    'Contains Soy',
    'Contains Shellfish',
    'Contains Wheat',

    // Spice Level
    'Mild',
    'Medium',
    'Spicy',
    'Very Spicy',
    'Extra Hot',

    // Beverage Categories
    'Drinks',
    'Alcoholic',
    'Non-Alcoholic',
    'Hot Drinks',
    'Cold Drinks',
    'Smoothies',
    'Cocktails',
    'Wine',
    'Beer',
    'Soft Drinks',
    'Coffee',
    'Tea',
    'Juice',

    // Cuisine Types
    'Italian',
    'Mexican',
    'Chinese',
    'Japanese',
    'Thai',
    'Indian',
    'Mediterranean',
    'American',
    'French',
    'Greek',
    'Korean',
    'Vietnamese',
    'Middle Eastern',
    'Fusion',

    // Special Categories
    'Chef\'s Special',
    'House Specialty',
    'Seasonal',
    'Local Favorite',
    'New Item',
    'Popular',
    'Limited Time',
    'Award Winning',

    // Preparation Method
    'Grilled',
    'Fried',
    'Baked',
    'Steamed',
    'Raw',
    'Smoked',
    'Roasted',
    'Sautéed',
    'Braised',

    // Protein Types
    'Beef',
    'Chicken',
    'Pork',
    'Fish',
    'Seafood',
    'Lamb',
    'Duck',
    'Turkey',
    'Tofu',

    // Time of Day
    'All Day',
    'Breakfast Only',
    'Lunch Only',
    'Dinner Only',
    'Late Night',

    // Portion Size
    'Small Plate',
    'Regular',
    'Large Plate',
    'Family Size',
    'Sharing Plate'
  ].sort()) // Sort alphabetically for easier selection
  const [newTag, setNewTag] = useState('')
  const [showJsonImporter, setShowJsonImporter] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Update local items when props items change
  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const handleSave = () => {
    onItemsChange(localItems)
    onOpenChange(false)
  }

  const addTag = (index: number, tag: string) => {
    const newItems = [...localItems]
    if (!newItems[index].tags?.includes(tag)) {
      newItems[index].tags = [...(newItems[index].tags || []), tag]
      setLocalItems(newItems)
    }
  }

  const removeTag = (index: number, tag: string) => {
    const newItems = [...localItems]
    newItems[index].tags = newItems[index].tags?.filter(t => t !== tag) || []
    setLocalItems(newItems)
  }

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const imageUrl = await uploadImage(file, 'menu-items')
      const newItems = [...localItems]
      newItems[index] = { ...newItems[index], image: imageUrl }
      setLocalItems(newItems)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  // Process JSON menu items
  const processJsonMenuItems = () => {
    try {
      setJsonError(null)
      const menuData = JSON.parse(jsonInput)
      
      const newMenuItems: MenuItem[] = []
      
      // Process each category
      Object.entries(menuData).forEach(([category, categoryItems]: [string, any]) => {
        // Skip if not an array
        if (!Array.isArray(categoryItems)) return
        
        // Process each item in the category
        categoryItems.forEach((item: any) => {
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
        onItemsChange([...items, ...newMenuItems])
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

  // Add function to delete a menu item
  const handleDeleteItem = (index: number) => {
    const newItems = [...localItems];
    newItems.splice(index, 1);
    setLocalItems(newItems);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col my-15">
        <DialogHeader>
          <DialogTitle>Menu Items</DialogTitle>
        </DialogHeader>

        {/* JSON Import Button */}
        <div className="flex justify-between mb-4">
          <Button
            onClick={() => {
              const newItem: MenuItem = {
                title: "",
                description: "",
                price: "",
                tags: [],
              };
              setLocalItems([...localItems, newItem]);
            }}
            variant="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
          <Button variant="outline" onClick={() => setShowJsonImporter(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
        </div>

        {/* JSON Import Dialog */}
        {showJsonImporter && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-[600px] max-w-[90vw] max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Import Menu Items from JSON</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowJsonImporter(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
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
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowJsonImporter(false)}>
                  Cancel
                </Button>
                <Button onClick={processJsonMenuItems}>
                  Add Items
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Table Header - Make it sticky with no top gap */}
          <div className="sticky top-0 z-10 grid grid-cols-[3fr,3fr,2fr,2fr,1.5fr,0.5fr] gap-4 px-4 py-2 bg-gray-100 rounded-t-lg border-b">
            <div className="font-medium">Title</div>
            <div className="font-medium">Description</div>
            <div className="font-medium">Price</div>
            <div className="font-medium">Tags</div>
            <div className="font-medium">Image</div>
            <div className="font-medium"></div> {/* Column for delete button */}
          </div>

          {/* Table Body with padding */}
          <div className="space-y-2 p-4">
            {localItems.map((item, index) => (
              <div key={index} className="grid grid-cols-[3fr,3fr,2fr,2fr,1.5fr,0.5fr] gap-4 px-4 py-2 bg-white rounded-lg border">
                <div className="col-span-3">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...localItems]
                      newItems[index] = { ...item, title: e.target.value }
                      setLocalItems(newItems)
                    }}
                    placeholder="Item title"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...localItems]
                      newItems[index] = { ...item, description: e.target.value }
                      setLocalItems(newItems)
                    }}
                    placeholder="Description"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...localItems]
                      newItems[index] = { ...item, price: e.target.value }
                      setLocalItems(newItems)
                    }}
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-2">
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    onChange={(e) => addTag(index, e.target.value)}
                    value=""
                  >
                    <option value="" disabled>Add tag...</option>
                    {availableTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTag(index, tag)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  {item.image && (
                    <div className="relative w-full h-24 mb-2">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => {
                          const newItems = [...localItems]
                          newItems[index] = { ...item, image: '' }
                          setLocalItems(newItems)
                        }}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(index, file)
                      }
                    }}
                  />
                </div>
                {/* Delete button column */}
                <div className="flex items-center justify-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteItem(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dialog footer with Save/Cancel buttons */}
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
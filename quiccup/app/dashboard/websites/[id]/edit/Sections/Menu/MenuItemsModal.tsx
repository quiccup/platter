import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload, FileSpreadsheet, X } from "lucide-react"
import { useState, useEffect } from "react"
import { uploadImage } from "@/lib/uploadImage"

interface MenuItem {
  title: string
  description: string
  price: string
  image?: string
  tags: string[]
}

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col my-15">
        {/* <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Menu Items</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Image
              </Button>
            </div>
          </div>
        </DialogHeader> */}

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Table Header - Make it sticky with no top gap */}
          <div className="sticky top-0 z-10 grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-t-lg border-b">
            <div className="col-span-3 font-medium">Title</div>
            <div className="col-span-3 font-medium">Description</div>
            <div className="col-span-2 font-medium">Price</div>
            <div className="col-span-2 font-medium">Tags</div>
            <div className="col-span-2 font-medium">Image</div>
          </div>

          {/* Table Body with padding */}
          <div className="space-y-2 p-4">
            {localItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 px-4 py-2 bg-white rounded-lg border">
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
              </div>
            ))}

            <Button 
              onClick={() => {
                setLocalItems([...localItems, { 
                  title: '', 
                  description: '', 
                  price: '', 
                  tags: [], 
                  image: '' 
                }])
              }} 
              variant="outline" 
              className="w-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Footer with Save button */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
'use client'
import { useState } from 'react'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Pencil, Search } from 'lucide-react'

interface Review {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
}

interface ReviewsEditProps {
  data: {
    reviews: Review[]
  }
  onChange: (data: { reviews: Review[] }) => void
}

export function ReviewsEdit({ data, onChange }: ReviewsEditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [reviews, setReviews] = useState<Review[]>(data.reviews || [])
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  })

  const handlePlaceSelect = () => {
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    )

    if (selectedPlace?.place_id) {
      placesService.getDetails(
        {
          placeId: selectedPlace.place_id,
          fields: ['reviews', 'name']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.reviews) {
            setReviews(place.reviews)
            onChange({ reviews: place.reviews })
          }
        }
      )
    }
  }

  return (
    <div>
      {/* Preview/Summary */}
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <p className="text-sm text-gray-500">
              {data.reviews?.length || 0} reviews imported
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Import Reviews
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Reviews</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {isLoaded ? (
              <div className="space-y-4">
                <div className="relative">
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocomplete.setTypes(['establishment'])
                    }}
                    onPlaceChanged={() => {
                      const place = (
                        document.getElementById('place-search') as HTMLInputElement
                      ).value
                      setSelectedPlace({ name: place } as google.maps.places.PlaceResult)
                      handlePlaceSelect()
                    }}
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="place-search"
                        className="pl-10"
                        placeholder="Search for your restaurant..."
                      />
                    </div>
                  </Autocomplete>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {reviews.map((review, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        {review.profile_photo_url && (
                          <img 
                            src={review.profile_photo_url} 
                            alt={review.author_name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{review.author_name}</p>
                          <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>Loading Google Maps...</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
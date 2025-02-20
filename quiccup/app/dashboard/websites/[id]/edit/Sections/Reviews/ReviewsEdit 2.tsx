'use client'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'

interface Review {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
}

export function ReviewsEdit() {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null)
  
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
            console.log('Fetched reviews:', place.reviews)
          }
        }
      )
    }
  }

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-medium">Search for your reviews online</h2>
      <div className="relative">
        <Autocomplete
          onLoad={(autocomplete) => {
            setAutocompleteInstance(autocomplete)
            autocomplete.setTypes(['establishment'])
          }}
          onPlaceChanged={() => {
            if (autocompleteInstance) {
              const place = autocompleteInstance.getPlace()
              setSelectedPlace(place)
              handlePlaceSelect()
            }
          }}
        >
          <input
            id="places-search"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Search for your restaurant..."
          />
        </Autocomplete>
      </div>

      {/* Display Reviews */}
      {reviews.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Latest Reviews</h3>
          {reviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2">
                {review.profile_photo_url && (
                  <img 
                    src={review.profile_photo_url} 
                    alt={review.author_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{review.author_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.time * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
                <p className="mt-1 text-gray-700">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
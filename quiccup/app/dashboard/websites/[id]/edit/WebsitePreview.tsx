'use client'

interface WebsitePreviewProps {
  data: {
    hero: { heading: string; description: string }
    menu: any[]
    chefs: any[]
    about: { content: string }
    contact: { email: string; phone: string }
  }
}

export function WebsitePreview({ data }: WebsitePreviewProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">
            {data.hero.heading || 'Your Restaurant Name'}
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            {data.hero.description || 'Add a description of your restaurant'}
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.menu.length > 0 ? (
              data.menu.map((item, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-orange-600 mt-2">${item.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center">Add menu items to see them here</p>
            )}
          </div>
        </div>
      </section>

      {/* Chefs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Chefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.chefs.length > 0 ? (
              data.chefs.map((chef, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4" />
                  <h3 className="font-semibold">{chef.name}</h3>
                  <p className="text-gray-600">{chef.role}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center">Add chefs to see them here</p>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center">
            {data.about.content || 'Add your restaurant\'s story'}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <div className="max-w-md mx-auto text-center">
            <p className="mb-2">
              <span className="font-semibold">Email:</span>{' '}
              {data.contact.email || 'Add your email'}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{' '}
              {data.contact.phone || 'Add your phone number'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 
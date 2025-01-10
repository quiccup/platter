import React from 'react';
import Image from 'next/image';

const ChefsFeed = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-12">Chef's Feed</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Chef's Post */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image 
                src="/placeholder-dish.jpg" 
                alt="Today's Special"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <span className="text-sm text-gray-500">2 hours ago</span>
              <h3 className="font-display text-xl font-semibold mt-2">Today's Special: Truffle Pasta</h3>
              <p className="text-gray-600 mt-2">
                Fresh handmade pasta tossed in a creamy truffle sauce, topped with shaved parmesan.
              </p>
              <div className="flex items-center mt-4 space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>123</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Add more posts as needed */}
        </div>
      </div>
    </section>
  );
};

export default ChefsFeed;
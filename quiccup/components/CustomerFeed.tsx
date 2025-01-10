import React from 'react';
import Image from 'next/image';

const CustomerFeed = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-12">Customer Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image 
                  src="/placeholder-avatar.jpg" 
                  alt="Customer"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">John Doe</h3>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "Amazing experience! The truffle pasta was absolutely divine. Can't wait to come back!"
            </p>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Posted 3 days ago</span>
            </div>
          </div>
          
          {/* Add more reviews as needed */}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeed;
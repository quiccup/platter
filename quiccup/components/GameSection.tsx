import React from 'react';

const GameSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-12">Play & Win</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Game Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-display text-2xl mb-4">Restaurant Runner</h3>
            <p className="text-gray-300 mb-4">
              Help Chef Mario collect all the ingredients while avoiding the kitchen hazards!
            </p>
            <div className="mb-4">
              <span className="text-yellow-400">High Score: 2,450</span>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Play Now
            </button>
          </div>
          
          {/* Rewards Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-display text-2xl mb-4">Your Rewards</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>Score 1,000 points</span>
                <span className="text-green-400">Free Dessert</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Score 2,500 points</span>
                <span className="text-green-400">10% Off Next Visit</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Score 5,000 points</span>
                <span className="text-green-400">Free Appetizer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameSection;
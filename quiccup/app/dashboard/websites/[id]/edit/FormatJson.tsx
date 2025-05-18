import React from 'react';
import { Utensils } from 'lucide-react';

interface MenuItem {
  id?: string;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
}

interface ApiMenuItem {
  title: string;
  price: number;
  category: string;
  description?: string;
}

interface ApiRecommendation {
  summary: string;
  item1?: ApiMenuItem;
  item2?: ApiMenuItem;
  item3?: ApiMenuItem;
  item4?: ApiMenuItem;
  item5?: ApiMenuItem;
  totalPrice: number;
}

const FormatJson = ({ content, menuItems = [] }: { content: string; menuItems: MenuItem[] }) => {
  try {
    const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const recommendations = JSON.parse(jsonStr) as ApiRecommendation[];
      if (recommendations && recommendations.length > 0) {
        const introText = content.substring(0, content.indexOf(jsonMatch[0])).trim();
        return (
          <div className="w-full space-y-4">
            {introText && (
              <div className="text-gray-800 text-base mb-4">{introText}</div>
            )}
            {recommendations.map((rec, idx) => {
              // Only collect items for this recommendation
              const recMenuItems: MenuItem[] = [];
              for (let i = 1; i <= 5; i++) {
                const itemKey = `item${i}` as keyof ApiRecommendation;
                const item = rec[itemKey] as ApiMenuItem | undefined;
                if (item) {
                  const menuItem = menuItems.find(
                    (mi: any) => mi.title.toLowerCase() === item.title.toLowerCase()
                  );
                  recMenuItems.push({
                    title: item.title,
                    price: item.price,
                    description: item.description || '',
                    category: item.category,
                    image: menuItem?.image
                  });
                }
              }
              return (
                <div key={idx} className="space-y-4">
                  <div className="font-bold text-lg">{rec.summary}</div>
                  <div className="relative">
                    <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                      {recMenuItems.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-64">
                          <div className="rounded-lg overflow-hidden shadow-md">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-40 object-cover"
                              />
                            ) : (
                              <div className="w-full h-40 bg-[#c27c36] flex items-center justify-center">
                                <Utensils className="h-8 w-8 text-white" />
                              </div>
                            )}
                            <div className="p-3 bg-white">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-base">{item.title}</h3>
                                <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description || 'No description available'}
                              </p>
                              <div className="text-xs text-gray-500 mt-1">{item.category}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-green-600">${rec.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
    }
  } catch (e) {
    console.error('Error parsing JSON response:', e);
  }
  return <div className="whitespace-pre-wrap text-base">{content}</div>;
};

export default FormatJson; 
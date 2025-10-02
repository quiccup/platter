import OpenAI from 'openai'
import { Message, RestaurantData } from '@/types/chat'
// Initialize the OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function callRestaurantLLM(messages: Message[], restaurantData: RestaurantData) {
  const formattedMenu = Array.isArray(restaurantData?.menu)
    ? restaurantData.menu
        .map(
          (item: any, index: number) =>
            `${index + 1}. ${item.name} - $${item.price} (${item.category || 'Menu Item'}): ${item.description || ''}`
        )
        .join('\n')
    : ''

  const systemPrompt = {
    role: 'system',
    content: `
     - Restaurant name: ${restaurantData?.name || 'our restaurant'}
     - Restaurant menu: ${formattedMenu || 'No menu available'}
     - You are a restaurant menu recommendation assistant. Based on the users message, either answer based on the given menu or generate the order in the order type json format shown below. 

      Example of order type JSON format:
       {
      "type": "order",
      "question": "Based on your preferences, I've built the perfect order for you!",
      "menuItems": [
        {"id": "menu item id", "name": "suitable menu item name", "price": "menu item price", "image": "menu item image"},
        ...(more menu items)
      ],
      "followUpQuestion": "Would you like to add side dishes, drinks, desserts, or other items?"
     }

     - After recommending the order, include a followUpQuestion field in the SAME JSON object (e.g., "Would you like to add side dishes, drinks, desserts, or other items?").
      DO NOT include any text before or after the JSON object. ONLY return a single, valid JSON object.

      - Sample Input of what the user will say:
      "What can I get for a group of 4 people?",
      "What can I get under 25 dollars?",
      "Whats famous here?"

      - Always prioritize the user's budget when generating an order. Only exceed the budget if it is absolutely impossible to generate any order that fits both the user's preferences and budget. If you must exceed the budget, return the closest possible order and clearly explain to the user why the budget could not be met.
    
      - If the user's message is informational (e.g., asking about dietary restrictions, menu details, restaurant info, etc.), respond with a plain text answer. Do NOT return a JSON object in this case.
      `,
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [systemPrompt, ...messages],
    temperature: 0,
  })

  return completion.choices[0]?.message?.content || "Sorry, I couldn't process your request."
}

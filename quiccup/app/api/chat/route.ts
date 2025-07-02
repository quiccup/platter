import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize the OpenAI client with X.AI configuration
const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function POST(request: NextRequest) {
  try {
    const { messages, restaurantData , order} = await request.json();

    console.log(restaurantData.menu);

    // Format menu items for better readability
    const formattedMenu = Array.isArray(restaurantData?.menu) 
      ? restaurantData.menu.map((item: any, index: number) => 
          `${index + 1}. ${item.title} - $${item.price} (${item.category}): ${item.description || ''}`
        ).join('\n')
      : '';

    // Add a system prompt for restaurant context using the developer message pattern
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
      `
    };

    try {
      const completion = await client.chat.completions.create({
        model: "grok-3-latest",
        messages: [systemPrompt, ...messages],
        temperature: 0,
      });

      const response = completion.choices[0]?.message?.content || "Sorry, I couldn't process your request.";
      return NextResponse.json({ response });
      
    } catch (apiError) {
      console.error('X.AI API error:', apiError);
      return NextResponse.json({ error: 'Failed to get response from X.AI' }, { status: 500 });
    }

  } catch (err) {
    console.error('Error in chat API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
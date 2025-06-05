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
     - You are a restaurant menu recommendation assistant. Analyse the full menu and give the user keyword options in the keyword type JSON format to understand their order requirements:

      Example of keyword type JSON format:
       {
      "type": "keywords",
      "question": "tell me about your preferences?",
      "options": [
        {"id": "id1", "name": "vegetarian"},
        {"id": "id2", "name": "vegan"},
        ...(more options based on the menu)
      ]
     }

     Ask the user upto to 5 questions to understand their order requirements.

     - Then generate a full order in the order type JSON format

     {
      "type": "order",
      "question": "Based on your preferences, I've built the perfect order for you!",
      "menuItems": [
        {"id": "menu item id", "name": "suitable menu item name", "price": "menu item price", "image": "menu item image"},
        ...(more mennu items)
      ]
     }

      - Sample Input of what the user will say:
      "What can I get for a group of 4 people?",
      "What can I get under 25 dollars?",
      "Whats famous here?"
    
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
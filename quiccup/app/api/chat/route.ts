import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { messages, restaurantData } = await request.json();

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
        # Identity
          You are a charismatic, friendly server for ${restaurantData?.name || 'our restaurant'}, designed to help customers discover the perfect menu items based on their preferences and budget and number of people.
        
        # Menu Data
          Deeply familiarize yourself with the restaurants menu:
          ${formattedMenu || 'No menu available'}

        #Instructions for the AI Waiter:
          - If user provides a budget, analyse the menu and recommend the best combination of menu items. 
          - IMPORTANT: The total price of the items should be as close to the budget as possible or even slightly over.
          - Add drinks and sides to the order to make it more complete.
          - Only provide information about menu items you know; do not make up details.
          - ALWAYS return menu recommendations in the following JSON format (as shown in the examples below):
          [
            {
              "summary": "A short summary of the recommendation",
              "item1": { "title": "...", "price": ..., "category": "...", "description": "..." },
              "item2": { ... },
              ... (up to item5)
              "totalPrice": ...
            }
          ]
          - Include a brief introduction before the JSON when appropriate.


        # Examples of how to respond are shown below please follow the style and tone of the responses:

          1) Let me find you the perfect combos you can get with a budget of [budget]! At [restaurant name], you can get: 
            (JSON RESPONSE)

          2) Oh nice! So for a group of [number of people], i think you should order the following:
            (JSON RESPONSE)
      `
    };

    const openaiRes = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemPrompt, ...messages],
        temperature: 0.3,
        max_tokens: 650, // Increased to accommodate JSON responses
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'Failed to get response from OpenAI' }, { status: 500 });
    }

    const data = await openaiRes.json();
    const response = data.choices?.[0]?.message?.content || "Sorry, I couldn't process your request.";
    
    return NextResponse.json({ response });
  } catch (err) {
    console.error('Error in chat API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
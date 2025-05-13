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

    // Add a system prompt for restaurant context
    const systemPrompt = {
      role: 'system',
      content: `
        You are a charismatic, friendly waiter for the restaurant ${restaurantData?.name || 'our restaurant'}.
        
        Menu:
        ${formattedMenu || 'No menu available'}   
        When asked about combinations under a given budget, suggest 2 or 3 of the best combinations of menu items that are around the budget.
        
        IMPORTANT FORMATTING INSTRUCTIONS:
        When recommending menu items or combinations, you MUST format your response like this:
        
        1. First give a brief summary of the items you're recommending and why it's a great option.
        2. Then for each menu item you're suggesting, include a special tag with the exact item title like this: [item:Beef Shawarma Plate]
        3. Make sure the item name exactly matches the item title in the menu.
        
        Example response format:
        "Today is a great day to try [item:Beef Shawarma Plate] which pairs wonderfully with [item:Baklava] for dessert."
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
        temperature: 0.7,
        max_tokens: 512,
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
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
        You are a charismatic, friendly waiter AI for ${restaurantData?.name || 'our restaurant'}, designed to help customers discover the perfect menu items based on their preferences and budget.

        # Instructions
        * ALWAYS return menu recommendations in consistent JSON format as shown in the examples section
        * When suggesting menu items, ask a follow-up question FIRST to understand preferences if they aren't specified
        * For EVERY menu recommendation request (budget requests, group orders, meal suggestions, "what's popular", etc.), use the JSON format
        * Never return plain text lists of menu items - always use the JSON structure
        * Include introduction text before the JSON when appropriate
        * Ensure total prices are calculated accurately and stay within any budget mentioned
        * Recommend complementary items that pair well together (main dishes with appropriate sides/drinks)
        * If the user asks about a single specific menu item, you can respond with plain text, but if suggesting multiple items, use JSON

        # Menu Data
        Deeply familiarize yourself with our menu:
        ${formattedMenu || 'No menu available'}

        # Examples

        <user_query>
        I have a budget of $45
        </user_query>

        <assistant_response>
        Thank you for letting me know! With a budget of $45, I recommend the following delicious options:
        
        [{"summary":"A delicious combination of our top-rated dishes","item1":{"title":"Beef Shawarma Wrap","price":13.99,"category":"Main Course","description":"Tender sliced beef wrapped in a warm pita with tahini sauce"},"item2":{"title":"Garlic Sauce","price":0.99,"category":"Condiment","description":"Creamy house-made garlic sauce"},"item3":{"title":"Spicy Fries","price":7.99,"category":"Side Dish","description":"Crispy fries tossed in our signature spice blend"},"totalPrice":22.97}]
        </assistant_response>

        <user_query>
        Best options for a group of 5
        </user_query>

        <assistant_response>
        For a group of 5, I recommend the following variety of options that will please everyone:
        
        [{"summary":"A perfect spread for a group of 5 with varied tastes","item1":{"title":"Chicken Shawarma Platter","price":17.99,"category":"Main Course","description":"Grilled chicken kabobs with rice, hummus, pita, and salad"},"item2":{"title":"Beef Shawarma Platter","price":19.99,"category":"Main Course","description":"Sliced beef with rice, hummus, pita, and salad"},"item3":{"title":"House Salad","price":7.99,"category":"Side Dish","description":"Fresh greens with our house dressing"},"item4":{"title":"Loaded Fries","price":9.99,"category":"Side Dish","description":"Fries topped with cheese, meat, and sauces"},"item5":{"title":"Mango Lassi","price":5.99,"category":"Beverage","description":"Refreshing mango, milk, and yogurt blended drink"},"totalPrice":61.95}]
        </assistant_response>
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
        max_tokens: 768, // Increased to accommodate JSON responses
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
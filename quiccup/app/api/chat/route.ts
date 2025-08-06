import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, restaurantData } = await request.json()
    console.log('restaurantData.menu:', restaurantData.menu)
    const userMessage = messages[messages.length-1]?.content || ''
    let items = []

    try {
      const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: userMessage
      })

      const queryEmbedding = response.data[0].embedding

      const { data, error } = await supabase.rpc('match_menu_items', {
        query_embedding: queryEmbedding,
        match_count: 10,
        restaurant_id: restaurantData.id
      })

      if (error) {
        console.error('❌ Supabase RPC error:', {
        message: error.message,
        code: error.code,
        details: error.details
        })
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      items = data

    } catch (err) {
      console.error('🔥 Unexpected error in /api/chat:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    
    const formattedMenu = items
    .map((item: any, index: number) =>
      `${index + 1}. ${item.name} - $${item.price}: ${item.description}`
    )
    .join('\n')

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
      model: 'gpt-3.5-turbo', // Use OpenAI's model
      messages: [systemPrompt, ...messages],
      temperature: 0,
    })

    const response = completion.choices[0]?.message?.content || "Sorry, I couldn't process your request."
    return NextResponse.json({ response })
  } catch (err) {
    console.error('Error in chat API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

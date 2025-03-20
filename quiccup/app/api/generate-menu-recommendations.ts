import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// This endpoint is called when menu is updated, not by end users
export async function POST(req: NextRequest) {
  try {
    const { websiteId, menuItems } = await req.json()
    
    // Only allow authenticated admin requests
    // [Add authentication verification here]
    
    // Define budget increments from $10 to $200
    const budgetIncrements = Array.from({length: 20}, (_, i) => (i + 1) * 10)
    
    const recommendations = {}
    
    // Generate recommendations for each budget increment
    for (const budget of budgetIncrements) {
      const menuJson = JSON.stringify(menuItems)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a culinary expert who creates perfect meal combinations. Suggest the best menu combinations that stay within budget while maximizing variety and value."
          },
          {
            role: "user", 
            content: `I have $${budget} to spend. Here's the menu: ${menuJson}. Please suggest the best combination of items I can get within my budget. Format your response as JSON with these fields only: recommendedItems (array of full item objects), explanation (why this combination is good, keep it conversational and personal), and totalPrice (number).`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" }
      })
      
      recommendations[budget] = JSON.parse(completion.choices[0].message.content)
    }
    
    // Store the recommendations in database
    const { error } = await supabase
      .from('menu_recommendations')
      .upsert({
        website_id: websiteId,
        recommendations: recommendations,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'website_id'
      })
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error generating menu recommendations:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
} 
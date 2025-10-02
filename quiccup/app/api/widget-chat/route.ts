import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { callRestaurantLLM } from '@/lib/chat'

export async function POST(request: NextRequest) {
  try {
    const { messages, apiKey } = await request.json()
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }
    
    // Validate API key and get user data
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, restaurant_name, api_key')
      .eq('api_key', apiKey)
      .single()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }
    
    // Get user's actual menu data
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')
      .eq('user_id', user.id)
    
    // Format restaurant data for the LLM
    const restaurantData = {
      name: user.restaurant_name,
      menu: menuItems || []
    }
    
    // Call the extracted LLM function
    const response = await callRestaurantLLM(messages, restaurantData)
    
    return NextResponse.json({ response })
  } catch (err) {
    console.error('Error in widget chat API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

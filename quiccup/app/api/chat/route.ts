import { NextRequest, NextResponse } from 'next/server'
import { callRestaurantLLM } from '@/lib/chat'

export async function POST(request: NextRequest) {
  try {
    const { messages, restaurantData } = await request.json()

    console.log("here!", restaurantData)

    const response = await callRestaurantLLM(messages, restaurantData)
    return NextResponse.json({ response })
  } catch (err) {
    console.error('Error in chat API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

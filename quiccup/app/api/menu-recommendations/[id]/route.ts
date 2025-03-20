import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const websiteId = params.id
    const budget = Number(req.nextUrl.searchParams.get('budget') || '30')
    
    // Find the appropriate budget increment (round down to nearest 10)
    const budgetIncrement = Math.floor(budget / 10) * 10
    
    // Get recommendations from database
    const { data, error } = await supabase
      .from('menu_recommendations')
      .select('recommendations')
      .eq('website_id', websiteId)
      .single()
    
    if (error) throw error
    
    // If we have recommendations for this budget increment, return them
    if (data?.recommendations && data.recommendations[budgetIncrement]) {
      return NextResponse.json(data.recommendations[budgetIncrement])
    }
    
    // If the budget is less than 10 or recommendations don't exist
    return NextResponse.json({ 
      error: 'No recommendations available for this budget',
      budgetIncrement
    }, { status: 404 })
    
  } catch (error) {
    console.error('Error fetching menu recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
} 
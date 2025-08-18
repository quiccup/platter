import { NextRequest, NextResponse } from 'next/server'

/*
Generates embeddings for a menu item
*/
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small'
      })
    })

    const result = await response.json()
    
    if (result.error) {
      console.error('OpenAI API error:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ embedding: result.data[0].embedding })
  } catch (error) {
    console.error('Error generating embedding:', error)
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 })
  }
}

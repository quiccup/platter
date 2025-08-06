import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') })

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function embed(menuItems: any[]) {
  const texts = []

  for (const menuItem of menuItems) {
    const inputText = `
        id: ${menuItem.id}
        name: ${menuItem.name}
        price: ${menuItem.price}
        description: ${menuItem.description}
        tags: ${menuItem.tags.join(', ')}
        `.trim()

    texts.push(inputText)

    try {
      const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: inputText
      })

      const embedding = response.data[0].embedding

      const { error } = await supabase
        .from('menu_items')
        .update({ embedding })
        .eq('id', menuItem.id)

      if (error) {
        console.error(`❌ Failed to update ${menuItem.name}:`, error)
      } else {
        console.log(`✅ Embedded ${menuItem.name}`)
      }

    } catch (err) {
      console.error(`❌ Error embedding ${menuItem.name}:`, err)
    }
  }
}

async function main() {
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select(`
      id, 
      name, 
      price, 
      description,
      menu_item_tag_map(
        tags(name)
      )
    `)

  if (error) {
    console.error('❌ Error fetching menu items:', error)
    return
  }

  if (!menuItems) {
    console.error('❌ No menu items found')
    return
  }

  for (const menuItem of menuItems) {
    const tags = menuItem.menu_item_tag_map?.map(m => m.tags.name) || []
    menuItem.tags = tags
  }

  await embed(menuItems) 
}

main()

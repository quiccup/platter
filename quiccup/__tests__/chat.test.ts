import { POST } from '../app/api/chat/route';
import { NextRequest } from 'next/server';

// Mock Supabase client
jest.mock('../utils/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null })
    })
  })
}));

global.URL = URL;
global.URLSearchParams = URLSearchParams;

// ---- Types & helpers
type Order = {
  type: 'order';
  menuItems: { name: string; price: number | string }[];
  followUpQuestion?: string;
};

// ---- Test data
const testMenuItems = [
  {
    name: 'Classic Burger',
    price: 12.99,
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    tags: ['burger', 'meat', 'classic'],
  },
  {
    name: 'Margherita Pizza',
    price: 14.99,
    description: 'Fresh mozzarella, tomatoes, and basil on thin crust',
    tags: ['pizza', 'vegetarian', 'italian'],
  },
  {
    name: 'Caesar Salad',
    price: 9.99,
    description: 'Crisp romaine, parmesan, croutons with Caesar dressing',
    tags: ['salad', 'starter'],
  },
  {
    name: 'Chocolate Lava Cake',
    price: 7.99,
    description: 'Warm chocolate cake with molten center',
    tags: ['dessert', 'chocolate'],
  },
];

const MEAT_TAG = 'meat';

const isMeatItem = (item: typeof testMenuItems[number]) => item.tags.includes(MEAT_TAG);

const menuNames = new Set(testMenuItems.map(m => m.name));
const meatItems = testMenuItems.filter(isMeatItem);
const vegItems = testMenuItems.filter(item => item.tags.includes('vegetarian'));

function assertItemsFromMenu(order: Order) {
  for (const it of order.menuItems) {
    expect(menuNames.has(it.name)).toBe(true);
  }
}

function extractJsonBlock(s: string): string {
  const m = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return m ? m[1] : s;
}

function ensureOrder(response: string): Order {
  const raw = extractJsonBlock(response);
  let obj: any;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new Error(`Expected JSON order but got:\n${response}`);
  }
  expect(obj).toHaveProperty('type', 'order');
  expect(Array.isArray(obj.menuItems)).toBe(true);
  expect(typeof obj.followUpQuestion).toBe('string');
  expect(obj.followUpQuestion.length).toBeGreaterThan(0);
  return obj as Order;
}

function looksLikeOrderJson(response: string): boolean {
  const raw = extractJsonBlock(response).trim();
  try {
    const j = JSON.parse(raw);
    return j && j.type === 'order' && Array.isArray(j.menuItems);
  } catch {
    return false;
  }
}

function toNumber(p: unknown): number {
  if (typeof p === 'number') return p;
  if (typeof p === 'string') {
    const n = parseFloat(p.replace(/[^0-9.]/g, '')); // handles "$12.99"
    if (!Number.isFinite(n)) throw new Error(`Invalid price: ${p}`);
    return n;
  }
  throw new Error(`Unsupported price type: ${typeof p}`);
}

async function testChatResponse(query: string) {
  const body = JSON.stringify({
    messages: [{ role: 'user', content: query }],
    restaurantData: {
      name: 'Test Restaurant',
      menu: testMenuItems.map(item => ({
        title: item.name,
        price: item.price,
        description: item.description,
        category: item.tags[0],
      })),
    },
  });

  const req = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
  const res = await POST(req as any);
  return res.json() as Promise<{ response: string }>;
}

// ---- Tests ----
describe('Chat LLM Tests', () => {
  test('handles menu inquiries', async () => {
    const { response } = await testChatResponse("What's on the menu?");
    const hits = testMenuItems.filter(m => response.includes(m.name)).length;
    expect(hits).toBeGreaterThanOrEqual(2);
  });

  test('understands dietary preferences (vegetarian)', async () => {
    const { response } = await testChatResponse('What vegetarian options do you have?');
    for (const meat of meatItems) {
      expect(response).not.toContain(meat.name);
    }
    expect(vegItems.some(v => response.includes(v.name))).toBe(true);
  });

  test('generates order recommendations', async () => {
    const { response } = await testChatResponse('I want to order food for 4 people');
    const order = ensureOrder(response);
    assertItemsFromMenu(order);
    expect(order.menuItems.length).toBeGreaterThanOrEqual(2);
  });

  test('handles budget constraints', async () => {
    const budget = 10;
    const { response } = await testChatResponse(`What can I get for under $${budget}?`);

    if (looksLikeOrderJson(response)) {
      const order = ensureOrder(response);
      assertItemsFromMenu(order);
      for (const it of order.menuItems) {
        expect(toNumber(it.price)).toBeLessThanOrEqual(budget);
      }
    } else {
      const mentioned = testMenuItems.filter(m => response.includes(m.name));
      for (const m of mentioned) {
        expect(m.price).toBeLessThanOrEqual(budget);
      }
    }
  });

  test('handles complex queries (vegetarian & budget)', async () => {
    const budget = 15;
    const { response } = await testChatResponse("I'm vegetarian and looking for something under $15");

    if (looksLikeOrderJson(response)) {
      const order = ensureOrder(response);
      assertItemsFromMenu(order);
      for (const it of order.menuItems) {
        expect(vegItems.some(v => v.name === it.name)).toBe(true);
        expect(toNumber(it.price)).toBeLessThanOrEqual(budget);
      }
    } else {
      for (const meat of meatItems) {
        expect(response).not.toContain(meat.name);
      }
      const underBudgetVegNames = vegItems
        .filter(m => m.price <= budget)
        .map(m => m.name);
      expect(underBudgetVegNames.some(name => response.includes(name))).toBe(true);
    }
  });
});
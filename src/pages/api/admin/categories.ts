import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

type CategoryCount = {
  name: string;
  count: number;
}

type Data = {
  categories?: CategoryCount[]
  error?: string
}

// Map legacy/human category strings to canonical names
function normalizeCategory(cat: string | null | undefined): string | null {
  if (!cat) return null
  const c = cat.trim()
  if (!c) return null
  const lower = c.toLowerCase()
  if (['justmet', 'just met', 'just_met', 'just-met'].includes(lower)) return 'Laughs'
  if (['onlyfriends', 'only friends', 'only_friends', 'only-friends'].includes(lower)) return 'Stories'
  if (['lovers', 'lover'].includes(lower)) return 'Secrets'
  // If it's already canonical (or unknown), try to normalize casing
  if (['laughs', 'stories', 'secrets'].includes(lower)) return lower[0].toUpperCase() + lower.slice(1)
  // Unknown: return title-cased version so it still appears
  return lower[0].toUpperCase() + lower.slice(1)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get counts from questions table grouped by raw category value
    const result = await sql`
      SELECT category, COUNT(*) as cnt
      FROM questions
      GROUP BY category
    `

    // Reduce into canonical buckets
    const countsByCanonical: Record<string, number> = {}

    for (const row of result.rows) {
      const raw = row.category as string | null
      const cnt = Number(row.cnt) || 0
      const canonical = normalizeCategory(raw)
      if (!canonical) continue
      countsByCanonical[canonical] = (countsByCanonical[canonical] || 0) + cnt
    }

    // Ensure the three canonical categories exist even if zero
    const canonicalOrder = ['Laughs', 'Stories', 'Secrets']
    const categories: CategoryCount[] = canonicalOrder.map(name => ({
      name,
      count: countsByCanonical[name] || 0
    }))

    return res.status(200).json({ categories })
  } catch (error) {
    console.error('Error fetching categories from database:', error)
    return res.status(500).json({ error: 'Failed to fetch categories from database' })
  }
}
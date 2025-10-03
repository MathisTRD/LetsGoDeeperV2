import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

type Data = {
  questions?: string[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sheet } = req.query

  if (!sheet || typeof sheet !== 'string') {
    return res.status(400).json({ error: 'Sheet parameter is required' })
  }

  // Create a list of possible database category variants (lowercased)
  // so we can match legacy values like "Just Met", "JustMet", etc.
  const variantsByCanonical: Record<string, string[]> = {
    Laughs: ['laughs', 'justmet', 'just met', 'just_met', 'just-met'],
    Stories: ['stories', 'onlyfriends', 'only friends', 'only_friends', 'only-friends'],
    Secrets: ['secrets', 'lovers', 'lover']
  }

  const requested = sheet.trim()
  // Normalize requested into canonical if it's one of the canonical names (case-insensitive)
  const canonical = ['laughs', 'stories', 'secrets'].includes(requested.toLowerCase())
    ? requested[0].toUpperCase() + requested.slice(1).toLowerCase()
    : requested

  const variants = variantsByCanonical[canonical] || [requested.toLowerCase()]

  try {
    // Query all questions and filter in JS by matching LOWER(category)
    const result = await sql`
      SELECT question, category
      FROM questions
      ORDER BY id
    `

    const questions = result.rows
      .filter((row: any) => {
        const cat = (row.category || '').toString().trim().toLowerCase()
        return variants.includes(cat)
      })
      .map((row: any) => row.question)
    
    return res.status(200).json({ questions })
  } catch (error) {
    console.error('Error fetching questions from database:', error)
    return res.status(500).json({ error: 'Failed to fetch data from database' })
  }
}
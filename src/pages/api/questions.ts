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

  try {
    // Query questions by category from the database
    const result = await sql`
      SELECT question 
      FROM questions 
      WHERE category = ${sheet}
      ORDER BY id
    `
    
    const questions = result.rows.map(row => row.question)
    
    return res.status(200).json({ questions })
  } catch (error) {
    console.error('Error fetching questions from database:', error)
    return res.status(500).json({ error: 'Failed to fetch data from database' })
  }
}
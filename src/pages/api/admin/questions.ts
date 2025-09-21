import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

type Data = {
  questions?: Array<{
    id: number;
    category: string;
    question: string;
  }>
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Query all questions with their IDs
    const result = await sql`
      SELECT id, category, question 
      FROM questions 
      ORDER BY category, id
    `
    
    const questions = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      question: row.question
    }))
    
    return res.status(200).json({ questions })
  } catch (error) {
    console.error('Error fetching all questions from database:', error)
    return res.status(500).json({ error: 'Failed to fetch questions from database' })
  }
}
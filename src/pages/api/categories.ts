import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

type Data = {
  categories?: string[]
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
    // Query all categories from the database
    const result = await sql`
      SELECT name 
      FROM categories 
      ORDER BY name
    `
    
    const categories = result.rows.map(row => row.name)
    
    return res.status(200).json({ categories })
  } catch (error) {
    console.error('Error fetching categories from database:', error)
    return res.status(500).json({ error: 'Failed to fetch categories from database' })
  }
}
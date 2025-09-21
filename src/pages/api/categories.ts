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
    // Return hardcoded categories for frontend display
    const categories = ['Laughs', 'Stories', 'Secrets']
    
    return res.status(200).json({ categories })
  } catch (error) {
    console.error('Error fetching categories from database:', error)
    return res.status(500).json({ error: 'Failed to fetch categories from database' })
  }
}
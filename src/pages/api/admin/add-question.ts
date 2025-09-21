import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

type Data = {
  success?: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { category, question, password } = req.body

  if (!category || !question || !password) {
    return res.status(400).json({ error: 'Category, question, and password are required' })
  }

  if (typeof category !== 'string' || typeof question !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'All fields must be strings' })
  }

  // Verify admin password
  const adminPassword = process.env.ADMIN_PASSWORD || 'letsgoDeeper2024'
  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // First, ensure the category exists
    await sql`
      INSERT INTO categories (name) 
      VALUES (${category}) 
      ON CONFLICT (name) DO NOTHING
    `

    // Then add the question
    await sql`
      INSERT INTO questions (category, question) 
      VALUES (${category}, ${question})
    `
    
    return res.status(200).json({ 
      success: true, 
      message: 'Question added successfully' 
    })
  } catch (error) {
    console.error('Error adding question to database:', error)
    return res.status(500).json({ error: 'Failed to add question to database' })
  }
}
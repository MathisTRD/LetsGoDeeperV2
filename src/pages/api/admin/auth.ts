import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

type Data = {
  success?: boolean
  message?: string
  error?: string
  token?: string
}

// Simple token generation (in production, use JWT or better auth)
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// In-memory token storage (in production, use Redis or database)
const validTokens = new Set<string>()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  // Get admin password from environment
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not set in environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Hash the provided password for comparison (basic security)
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
  const hashedAdminPassword = crypto.createHash('sha256').update(adminPassword).digest('hex')

  if (hashedPassword === hashedAdminPassword) {
    const token = generateToken()
    validTokens.add(token)
    
    // Clean up old tokens (keep last 10)
    if (validTokens.size > 10) {
      const tokensArray = Array.from(validTokens)
      validTokens.clear()
      tokensArray.slice(-10).forEach(t => validTokens.add(t))
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Authentication successful',
      token 
    })
  } else {
    return res.status(401).json({ error: 'Incorrect password' })
  }
}

// Export function to validate tokens
export const isValidToken = (token: string): boolean => {
  return validTokens.has(token)
}
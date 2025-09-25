// pages/api/analytics.ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface AnalyticsData {
  timestamp: string;
  page: string;
  userAgent: string;
  ip: string;
  referrer?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page, referrer } = req.body;
  
  const analyticsData: AnalyticsData = {
    timestamp: new Date().toISOString(),
    page: page || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    ip: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown',
    referrer: referrer
  };

  // Log to console (or save to database)
  console.log('📊 Analytics:', analyticsData);

  // TODO: Save to database
  // await saveToDatabase(analyticsData);

  res.status(200).json({ success: true });
}
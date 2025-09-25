import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      
      {/* Open Source Analytics - Umami */}
      <Script
        async
        defer
        data-website-id="your-website-id" // Replace with actual ID from Umami
        src="http://your-dokploy-server:3001/script.js" // Replace with your Umami URL
      />
      
      {/* Vercel Analytics (existing) */}
      <Analytics />
      <SpeedInsights />
    </>
  )
}
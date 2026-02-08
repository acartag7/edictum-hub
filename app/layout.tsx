import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/components/convex-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Edictum — Safety Contracts for AI Agents',
    template: '%s | Edictum',
  },
  description:
    'Runtime contract enforcement for AI agent tool calls. Stop agents before they break things.',
  keywords: [
    'AI safety',
    'agent safety',
    'AI governance',
    'tool safety',
    'LLM guardrails',
    'edictum',
  ],
  metadataBase: new URL('https://edictum.ai'),
  openGraph: {
    title: 'Edictum — Safety Contracts for AI Agents',
    description: 'Runtime contract enforcement for AI agent tool calls.',
    type: 'website',
    url: 'https://edictum.ai',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#00ff88',
          colorBackground: '#141414',
          colorText: '#e5e5e5',
          colorInputBackground: '#1a1a1a',
          colorInputText: '#e5e5e5',
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
        >
          <ConvexClientProvider>
            <Nav />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/components/convex-provider'
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
          colorPrimary: '#f59e0b',
          colorBackground: '#1a1a1a',
          colorText: '#e5e5e5',
          colorTextSecondary: '#a3a3a3',
          colorInputBackground: '#262626',
          colorInputText: '#e5e5e5',
          colorNeutral: '#e5e5e5',
          colorTextOnPrimaryBackground: '#000000',
          borderRadius: '0.5rem',
        },
        elements: {
          card: {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          userButtonPopoverCard: {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          userButtonPopoverActionButton: {
            color: '#e5e5e5',
          },
          userButtonPopoverActionButtonText: {
            color: '#e5e5e5',
          },
          userButtonPopoverActionButtonIcon: {
            color: '#a3a3a3',
          },
          userButtonPopoverFooter: {
            display: 'none',
          },
          userPreviewMainIdentifier: {
            color: '#e5e5e5',
          },
          userPreviewSecondaryIdentifier: {
            color: '#a3a3a3',
          },
          menuButton: {
            color: '#e5e5e5',
          },
          menuItem: {
            color: '#e5e5e5',
          },
          avatarBox: {
            border: '2px solid rgba(245,158,11,0.3)',
          },
          footer: {
            display: 'none',
          },
          footerAction: {
            display: 'none',
          },
          internal: {
            color: '#e5e5e5',
          },
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

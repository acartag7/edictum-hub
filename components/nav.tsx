'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Shield, Github, ExternalLink } from 'lucide-react'

const links = [
  { href: '/hub', label: 'Hub' },
  { href: '/playground', label: 'Playground' },
  { href: '/guides', label: 'Guides' },
  {
    href: 'https://acartag7.github.io/edictum/',
    label: 'Docs',
    external: true,
  },
  {
    href: 'https://github.com/acartag7/edictum',
    label: 'GitHub',
    external: true,
    icon: Github,
  },
]

export function Nav() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-accent" />
          <span className="font-mono text-lg font-bold tracking-tight">
            edictum
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === link.href || pathname?.startsWith(link.href + '/')
                  ? 'text-accent'
                  : 'text-muted hover:text-foreground'
              )}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
              {link.external && !link.icon && (
                <ExternalLink className="h-3 w-3" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                },
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  )
}

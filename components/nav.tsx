'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Github, ExternalLink } from 'lucide-react'
import { EdictumLogo } from '@/components/edictum-logo'

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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <EdictumLogo size={22} className="text-white/80" />
          <span className="text-[15px] font-semibold tracking-tight text-white/90">
            edictum
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/35">
            v0.5.3
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
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                pathname === link.href || pathname?.startsWith(link.href + '/')
                  ? 'text-accent'
                  : 'text-white/50 hover:text-white/80'
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
              <button className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  )
}

import Link from 'next/link'
import { EdictumLogo } from '@/components/edictum-logo'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <EdictumLogo size={16} className="text-foreground-tertiary" />
            <span className="text-[12px] text-foreground-tertiary">
              edictum — safety contracts for AI agents
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/hub"
              className="text-[12px] text-foreground-tertiary transition-colors hover:text-foreground-secondary"
            >
              Hub
            </Link>
            <Link
              href="/playground"
              className="text-[12px] text-foreground-tertiary transition-colors hover:text-foreground-secondary"
            >
              Playground
            </Link>
            <Link
              href="/guides"
              className="text-[12px] text-foreground-tertiary transition-colors hover:text-foreground-secondary"
            >
              Guides
            </Link>
            <a
              href="https://github.com/acartag7/edictum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-foreground-tertiary transition-colors hover:text-foreground-secondary"
            >
              GitHub
            </a>
            <a
              href="https://pypi.org/project/edictum/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-foreground-tertiary transition-colors hover:text-foreground-secondary"
            >
              PyPI
            </a>
          </div>
          <p className="text-[12px] text-foreground-tertiary">
            Built by{' '}
            <a
              href="https://github.com/acartag7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              Arnold Cartagena
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

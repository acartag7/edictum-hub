import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            <span className="font-mono text-sm text-muted">
              edictum — safety contracts for AI agents
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link
              href="/hub"
              className="hover:text-foreground transition-colors"
            >
              Hub
            </Link>
            <Link
              href="/guides"
              className="hover:text-foreground transition-colors"
            >
              Guides
            </Link>
            <a
              href="https://github.com/acartag7/edictum"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://pypi.org/project/edictum/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              PyPI
            </a>
          </div>
          <p className="text-sm text-muted">
            Built by{' '}
            <a
              href="https://github.com/acartag7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
            >
              Arnold Cartagena
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  'getting-started': 'Getting Started',
  contracts: 'Contracts',
  integrations: 'Integrations',
  advanced: 'Advanced',
}

export default function GuidesPage() {
  const guides = useQuery(api.guides.list)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-mono text-3xl font-bold">Guides</h1>
      <p className="mb-8 text-muted">
        Learn how to use Edictum to secure your AI agents.
      </p>

      {guides === undefined ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {guides.map((guide, index) => (
            <Link
              key={guide._id}
              href={`/guides/${guide.slug}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface p-6 transition-all hover:border-accent/30 hover:bg-surface-hover"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-sm font-bold text-accent">
                  {index + 1}
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-mono text-lg font-semibold group-hover:text-accent transition-colors">
                      {guide.title}
                    </h3>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                      {categoryLabels[guide.category] ?? guide.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{guide.description}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

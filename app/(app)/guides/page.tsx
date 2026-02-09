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
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
        Guides
      </h1>
      <p className="mb-8 text-[13px] text-white/40">
        Learn how to use Edictum to secure your AI agents.
      </p>

      {guides === undefined ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-white/[0.06] bg-[#0c0c0c]"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {guides.map((guide, index) => (
            <Link
              key={guide._id}
              href={`/guides/${guide.slug}`}
              className="group flex items-center justify-between rounded-lg border border-white/[0.05] bg-[#0c0c0c]/60 p-5 transition-all hover:border-white/[0.1]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/[0.08] font-mono text-[12px] font-bold text-accent/60">
                  {index + 1}
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-white/85 transition-colors group-hover:text-accent">
                      {guide.title}
                    </h3>
                    <span className="rounded-full border border-white/[0.05] px-2 py-0.5 text-[10px] text-white/30">
                      {categoryLabels[guide.category] ?? guide.category}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/35">
                    {guide.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white/20 transition-colors group-hover:text-accent/60" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

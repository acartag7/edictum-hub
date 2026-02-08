'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = useQuery(api.guides.getBySlug, { slug })

  if (guide === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-96 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-muted">Guide not found.</p>
        <Link
          href="/guides"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Back to Guides
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/guides"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="mb-4 font-mono text-3xl font-bold">{guide.title}</h1>
      <p className="mb-8 text-lg text-muted">{guide.description}</p>

      {/* Simple markdown rendering — renders pre/code blocks via CSS */}
      <div className="prose prose-invert max-w-none prose-headings:font-mono prose-code:font-mono prose-pre:bg-surface prose-pre:border prose-pre:border-border">
        {guide.content.split('\n').map((line, i) => {
          if (line.startsWith('# '))
            return (
              <h1 key={i} className="font-mono text-2xl font-bold mt-8 mb-4">
                {line.slice(2)}
              </h1>
            )
          if (line.startsWith('## '))
            return (
              <h2 key={i} className="font-mono text-xl font-bold mt-6 mb-3">
                {line.slice(3)}
              </h2>
            )
          if (line.startsWith('### '))
            return (
              <h3 key={i} className="font-mono text-lg font-semibold mt-4 mb-2">
                {line.slice(4)}
              </h3>
            )
          if (line.startsWith('```')) return null
          if (line === '') return <br key={i} />
          return (
            <p key={i} className="mb-2 text-muted leading-relaxed">
              {line}
            </p>
          )
        })}
      </div>
    </div>
  )
}

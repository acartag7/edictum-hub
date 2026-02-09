'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MarkdownRenderer } from '@/components/markdown-renderer'

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = useQuery(api.guides.getBySlug, { slug })

  if (guide === undefined) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-10">
        <div className="h-96 animate-pulse rounded-lg border border-white/[0.06] bg-[#0c0c0c]" />
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-10 text-center">
        <p className="text-[13px] text-white/40">Guide not found.</p>
        <Link
          href="/guides"
          className="mt-4 inline-block text-[13px] text-accent hover:underline"
        >
          Back to Guides
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/guides"
        className="mb-6 inline-flex items-center gap-1 text-[12px] text-white/35 transition-colors hover:text-white/60"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">
        {guide.title}
      </h1>
      <p className="mb-8 text-[14px] text-white/40">{guide.description}</p>

      <MarkdownRenderer content={guide.content} />
    </div>
  )
}

'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { CodeBlock } from '@/components/code-block'
import { Download, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ContractDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const contract = useQuery(api.contracts.getBySlug, { slug })
  const incrementDownloads = useMutation(api.contracts.incrementDownloads)

  if (contract === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-96 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted">Contract not found.</p>
        <Link
          href="/hub"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Back to Hub
        </Link>
      </div>
    )
  }

  const handleDownload = async () => {
    await incrementDownloads({ contractId: contract._id })
    const blob = new Blob([contract.yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contract.slug}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/hub"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hub
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 font-mono text-3xl font-bold">{contract.name}</h1>
          <p className="text-muted">{contract.description}</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-background transition-opacity hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4 text-sm text-muted">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {contract.averageRating} ({contract.ratingCount} ratings)
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          {contract.downloads} downloads
        </span>
        <span>by {contract.authorName}</span>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs text-accent">
          {contract.status}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {contract.tags.map(tag => (
          <span
            key={tag}
            className="rounded border border-border bg-surface px-2 py-1 text-xs font-mono text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <CodeBlock
        code={contract.yaml}
        language="yaml"
        filename={`${contract.slug}.yaml`}
      />
    </div>
  )
}

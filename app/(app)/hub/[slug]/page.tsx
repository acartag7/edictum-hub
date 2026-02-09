'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { CodeBlock } from '@/components/code-block'
import { RatingStars } from '@/components/rating-stars'
import { CommentsSection } from '@/components/comments-section'
import { Download, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ContractDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const contract = useQuery(api.contracts.getBySlug, { slug })
  const incrementDownloads = useMutation(api.contracts.incrementDownloads)

  if (contract === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-96 animate-pulse rounded-lg border border-white/[0.06] bg-[#0c0c0c]" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-white/35">Contract not found.</p>
        <Link
          href="/hub"
          className="mt-4 inline-block text-[12px] text-accent hover:underline"
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/hub"
        className="mb-6 inline-flex items-center gap-1 text-[12px] text-white/35 transition-colors hover:text-white/60"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Hub
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
            {contract.name}
          </h1>
          <p className="text-[13px] text-white/40">{contract.description}</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-accent/90"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4 text-[12px] text-white/35">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {contract.averageRating} ({contract.ratingCount} ratings)
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          {contract.downloads} downloads
        </span>
        <span>by {contract.authorName}</span>
        <span className="rounded-full border border-accent/20 bg-accent/[0.06] px-2 py-0.5 text-[11px] text-accent">
          {contract.status}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {contract.tags.map(tag => (
          <span
            key={tag}
            className="rounded border border-white/[0.05] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-white/30"
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

      <div className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold text-white/85">
          Python Usage
        </h2>
        <p className="mb-3 text-[12px] text-white/35">
          Install with:{' '}
          <code className="rounded border border-white/[0.05] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-accent">
            pip install edictum[yaml]
          </code>
        </p>
        <CodeBlock
          code={
            ['file-agent', 'research-agent', 'devops-agent'].includes(
              contract.slug
            )
              ? `from edictum import Edictum, EdictumDenied

# Load built-in template
guard = Edictum.from_template("${contract.slug}")

# Evaluate a tool call
try:
    result = await guard.run(
        "tool_name",
        {"arg": "value"},
        your_tool_function,
    )
except EdictumDenied as e:
    print(f"Denied: {e.reason}")`
              : `from edictum import Edictum, EdictumDenied

# Load this contract
guard = Edictum.from_yaml("${contract.slug}.yaml")

# Evaluate a tool call
try:
    result = await guard.run(
        "tool_name",
        {"arg": "value"},
        your_tool_function,
    )
except EdictumDenied as e:
    print(f"Denied: {e.reason}")`
          }
          language="python"
          filename="usage.py"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold text-white/85">
          Ratings
        </h2>
        <RatingStars
          contractId={contract._id}
          averageRating={contract.averageRating}
          ratingCount={contract.ratingCount}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold text-white/85">
          Comments
        </h2>
        <CommentsSection contractId={contract._id} />
      </div>
    </div>
  )
}

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Star, Download } from 'lucide-react'

const categoryColors: Record<string, string> = {
  'file-safety': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'data-protection': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'access-control': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  compliance: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'rate-limiting': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  general: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

interface ContractCardProps {
  name: string
  slug: string
  description: string
  category: string
  status: string
  averageRating: number
  downloads: number
  tags: string[]
}

export function ContractCard({
  name,
  slug,
  description,
  category,
  status,
  averageRating,
  downloads,
  tags,
}: ContractCardProps) {
  return (
    <Link
      href={`/hub/${slug}`}
      className="group flex flex-col rounded-lg border border-border bg-surface p-5 transition-all hover:border-accent/30 hover:bg-surface-hover"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs font-medium',
              categoryColors[category] ?? categoryColors.general
            )}
          >
            {category}
          </span>
          {status === 'official' && (
            <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              official
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-1 font-mono text-base font-semibold text-foreground group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-muted">{description}</p>

      <div className="mt-auto flex items-center justify-between text-sm text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {averageRating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {downloads}
          </span>
        </div>
        <div className="flex gap-1">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded bg-background px-1.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

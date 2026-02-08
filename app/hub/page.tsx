'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ContractCard } from '@/components/contract-card'
import { Search } from 'lucide-react'
import { useState } from 'react'

const categories = [
  { value: undefined, label: 'All' },
  { value: 'file-safety' as const, label: 'File Safety' },
  { value: 'data-protection' as const, label: 'Data Protection' },
  { value: 'access-control' as const, label: 'Access Control' },
  { value: 'compliance' as const, label: 'Compliance' },
  { value: 'rate-limiting' as const, label: 'Rate Limiting' },
  { value: 'general' as const, label: 'General' },
]

export default function HubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  )
  const [searchQuery, setSearchQuery] = useState('')

  const contracts = useQuery(api.contracts.list, {
    category: selectedCategory as
      | 'file-safety'
      | 'data-protection'
      | 'access-control'
      | 'compliance'
      | 'rate-limiting'
      | 'general'
      | undefined,
  })

  const searchResults = useQuery(
    api.contracts.search,
    searchQuery.length > 0 ? { query: searchQuery } : 'skip'
  )

  const displayContracts = searchQuery.length > 0 ? searchResults : contracts

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 font-mono text-3xl font-bold">Contract Hub</h1>
        <p className="text-muted">
          Browse, search, and download safety contracts for your AI agents.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.value
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-muted hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayContracts === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      ) : displayContracts.length === 0 ? (
        <div className="py-16 text-center text-muted">
          <p>No contracts found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayContracts.map(contract => (
            <ContractCard key={contract._id} {...contract} />
          ))}
        </div>
      )}
    </div>
  )
}

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
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
          Contract Hub
        </h1>
        <p className="text-[13px] text-white/40">
          Browse, search, and download safety contracts for your AI agents.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-white/[0.07] bg-[#0c0c0c] py-2 pl-9 pr-4 text-[13px] text-white/80 placeholder:text-white/20 focus:border-accent/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              selectedCategory === cat.value
                ? 'border-accent bg-accent/[0.06] text-accent'
                : 'border-white/[0.06] text-white/35 hover:text-white/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayContracts === undefined ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-white/[0.06] bg-[#0c0c0c]"
            />
          ))}
        </div>
      ) : displayContracts.length === 0 ? (
        <div className="py-16 text-center text-white/35">
          <p>No contracts found.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayContracts.map(contract => (
            <ContractCard key={contract._id} {...contract} />
          ))}
        </div>
      )}
    </div>
  )
}

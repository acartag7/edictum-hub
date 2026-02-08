'use client'

import { useUser, SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ContractCard } from '@/components/contract-card'

export default function MyContractsPage() {
  const { isSignedIn } = useUser()
  const contracts = useQuery(api.contracts.list, {})

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 font-mono text-2xl font-bold">My Contracts</h1>
        <p className="mb-6 text-muted">
          Sign in to see your submitted contracts.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-lg bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90">
            Sign In
          </button>
        </SignInButton>
      </div>
    )
  }

  // TODO: Filter by current user's authorId once we wire up the query
  const myContracts = contracts?.filter(c => c.status === 'community') ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-mono text-3xl font-bold">My Contracts</h1>
      <p className="mb-8 text-muted">
        Contracts you have submitted to the hub.
      </p>

      {myContracts.length === 0 ? (
        <div className="py-16 text-center text-muted">
          <p>You haven&apos;t submitted any contracts yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myContracts.map(contract => (
            <ContractCard key={contract._id} {...contract} />
          ))}
        </div>
      )}
    </div>
  )
}

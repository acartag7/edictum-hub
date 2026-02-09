'use client'

import { useUser, SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ContractCard } from '@/components/contract-card'

export default function MyContractsPage() {
  const { isSignedIn, user } = useUser()
  const contracts = useQuery(api.contracts.list, {})

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">
          My Contracts
        </h1>
        <p className="mb-6 text-[13px] text-white/40">
          Sign in to see your submitted contracts.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-accent/90">
            Sign In
          </button>
        </SignInButton>
      </div>
    )
  }

  const myContracts = contracts?.filter(c => c.authorId === user?.id) ?? []

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
        My Contracts
      </h1>
      <p className="mb-8 text-[13px] text-white/40">
        Contracts you have submitted to the hub.
      </p>

      {myContracts.length === 0 ? (
        <div className="py-16 text-center text-white/35">
          <p>You haven&apos;t submitted any contracts yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myContracts.map(contract => (
            <ContractCard key={contract._id} {...contract} />
          ))}
        </div>
      )}
    </div>
  )
}

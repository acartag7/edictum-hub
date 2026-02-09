'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser, SignInButton } from '@clerk/nextjs'
import { Star } from 'lucide-react'

export function RatingStars({
  contractId,
  averageRating,
  ratingCount,
}: {
  contractId: Id<'contracts'>
  averageRating: number
  ratingCount: number
}) {
  const { isSignedIn } = useUser()
  const userRating = useQuery(api.ratings.getUserRating, { contractId })
  const rate = useMutation(api.ratings.rate)

  const handleRate = async (score: number) => {
    if (!isSignedIn) return
    await rate({ contractId, score })
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(score => (
          <button
            key={score}
            onClick={() => handleRate(score)}
            disabled={!isSignedIn}
            className="p-0.5 transition-colors disabled:cursor-default"
          >
            <Star
              className={`h-5 w-5 ${
                userRating && score <= userRating.score
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-white/20 hover:text-white/40'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-[12px] text-white/35">
        {averageRating} ({ratingCount} ratings)
      </span>
      {!isSignedIn && (
        <SignInButton mode="modal">
          <button className="text-[12px] text-accent hover:underline">
            Sign in to rate
          </button>
        </SignInButton>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser, SignInButton } from '@clerk/nextjs'

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function CommentsSection({
  contractId,
}: {
  contractId: Id<'contracts'>
}) {
  const { isSignedIn } = useUser()
  const comments = useQuery(api.comments.list, { contractId })
  const createComment = useMutation(api.comments.create)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!body.trim() || submitting) return
    setSubmitting(true)
    try {
      await createComment({ contractId, body: body.trim() })
      setBody('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {isSignedIn ? (
        <div className="mb-6 space-y-3">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full rounded-md border border-white/[0.07] bg-[#0c0c0c] px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:border-accent/50 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!body.trim() || submitting}
            className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <SignInButton mode="modal">
            <button className="text-[13px] text-accent hover:underline">
              Sign in to comment
            </button>
          </SignInButton>
        </div>
      )}

      <div className="space-y-3">
        {comments === undefined && (
          <div className="h-20 animate-pulse rounded-lg border border-white/[0.05] bg-[#0c0c0c]/60" />
        )}
        {comments?.length === 0 && (
          <p className="text-[13px] text-white/25">No comments yet.</p>
        )}
        {comments?.map(comment => (
          <div
            key={comment._id}
            className="rounded-lg border border-white/[0.05] bg-[#0c0c0c]/60 p-4"
          >
            <div className="mb-2 flex items-center gap-2.5">
              {comment.userImageUrl ? (
                <Image
                  src={comment.userImageUrl}
                  alt={comment.userName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/[0.08] text-[12px] font-semibold text-accent">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-white/70">
                  {comment.userName}
                </span>
                <span className="text-[11px] text-white/25">
                  {relativeTime(comment._creationTime)}
                </span>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-white/40">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

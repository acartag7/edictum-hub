import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const rate = mutation({
  args: {
    contractId: v.id('contracts'),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Must be logged in to rate')
    if (args.score < 1 || args.score > 5) throw new Error('Score must be 1-5')

    const existing = await ctx.db
      .query('ratings')
      .withIndex('by_user_contract', q =>
        q.eq('userId', identity.subject).eq('contractId', args.contractId)
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { score: args.score })
    } else {
      await ctx.db.insert('ratings', {
        contractId: args.contractId,
        userId: identity.subject,
        score: args.score,
      })
    }

    // Recalculate average
    const allRatings = await ctx.db
      .query('ratings')
      .withIndex('by_contract', q => q.eq('contractId', args.contractId))
      .collect()

    const avg =
      allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length

    await ctx.db.patch(args.contractId, {
      averageRating: Math.round(avg * 10) / 10,
      ratingCount: allRatings.length,
    })
  },
})

export const getUserRating = query({
  args: { contractId: v.id('contracts') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db
      .query('ratings')
      .withIndex('by_user_contract', q =>
        q.eq('userId', identity.subject).eq('contractId', args.contractId)
      )
      .first()
  },
})

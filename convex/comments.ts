import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  args: { contractId: v.id('contracts') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('comments')
      .withIndex('by_contract', q => q.eq('contractId', args.contractId))
      .order('desc')
      .collect()
  },
})

export const create = mutation({
  args: {
    contractId: v.id('contracts'),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Must be logged in to comment')

    return await ctx.db.insert('comments', {
      contractId: args.contractId,
      userId: identity.subject,
      userName: identity.name ?? 'Anonymous',
      userImageUrl: identity.pictureUrl,
      body: args.body,
    })
  },
})

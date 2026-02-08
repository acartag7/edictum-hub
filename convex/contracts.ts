import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('file-safety'),
        v.literal('data-protection'),
        v.literal('access-control'),
        v.literal('compliance'),
        v.literal('rate-limiting'),
        v.literal('general')
      )
    ),
    status: v.optional(
      v.union(v.literal('official'), v.literal('community'), v.literal('draft'))
    ),
  },
  handler: async (ctx, args) => {
    const contracts = args.category
      ? await ctx.db
          .query('contracts')
          .withIndex('by_category', q => q.eq('category', args.category!))
          .collect()
      : await ctx.db.query('contracts').collect()

    if (args.status) {
      return contracts.filter(c => c.status === args.status)
    }

    return contracts
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contracts')
      .withIndex('by_slug', q => q.eq('slug', args.slug))
      .first()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    yaml: v.string(),
    category: v.union(
      v.literal('file-safety'),
      v.literal('data-protection'),
      v.literal('access-control'),
      v.literal('compliance'),
      v.literal('rate-limiting'),
      v.literal('general')
    ),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Must be logged in to create a contract')
    }

    return await ctx.db.insert('contracts', {
      ...args,
      status: 'community',
      authorId: identity.subject,
      authorName: identity.name ?? 'Anonymous',
      downloads: 0,
      averageRating: 0,
      ratingCount: 0,
      edictumVersion: '0.5.3',
    })
  },
})

export const incrementDownloads = mutation({
  args: { contractId: v.id('contracts') },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.contractId)
    if (!contract) throw new Error('Contract not found')
    await ctx.db.patch(args.contractId, {
      downloads: contract.downloads + 1,
    })
  },
})

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contracts')
      .withSearchIndex('search_contracts', q => q.search('name', args.query))
      .collect()
  },
})

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  contracts: defineTable({
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
    status: v.union(
      v.literal('official'),
      v.literal('community'),
      v.literal('draft')
    ),
    authorId: v.optional(v.string()),
    authorName: v.string(),
    downloads: v.number(),
    averageRating: v.number(),
    ratingCount: v.number(),
    tags: v.array(v.string()),
    edictumVersion: v.string(),
  })
    .index('by_slug', ['slug'])
    .index('by_category', ['category'])
    .index('by_status', ['status'])
    .index('by_downloads', ['downloads'])
    .searchIndex('search_contracts', {
      searchField: 'name',
      filterFields: ['category', 'status'],
    }),

  ratings: defineTable({
    contractId: v.id('contracts'),
    userId: v.string(),
    score: v.number(),
  })
    .index('by_contract', ['contractId'])
    .index('by_user_contract', ['userId', 'contractId']),

  comments: defineTable({
    contractId: v.id('contracts'),
    userId: v.string(),
    userName: v.string(),
    userImageUrl: v.optional(v.string()),
    body: v.string(),
  }).index('by_contract', ['contractId']),

  guides: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    order: v.number(),
    category: v.union(
      v.literal('getting-started'),
      v.literal('contracts'),
      v.literal('integrations'),
      v.literal('advanced')
    ),
  })
    .index('by_slug', ['slug'])
    .index('by_order', ['order'])
    .index('by_category', ['category']),
})

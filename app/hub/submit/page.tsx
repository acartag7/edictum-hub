'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignInButton } from '@clerk/nextjs'

export default function SubmitPage() {
  const { isSignedIn } = useUser()
  const createContract = useMutation(api.contracts.create)
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [yaml, setYaml] = useState('')
  const [category, setCategory] = useState<string>('general')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 font-mono text-2xl font-bold">Submit a Contract</h1>
        <p className="mb-6 text-muted">
          Sign in to submit your safety contract to the hub.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-lg bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90">
            Sign In to Continue
          </button>
        </SignInButton>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createContract({
        name,
        slug,
        description,
        yaml,
        category: category as
          | 'file-safety'
          | 'data-protection'
          | 'access-control'
          | 'compliance'
          | 'rate-limiting'
          | 'general',
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      })
      router.push('/hub')
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 font-mono text-3xl font-bold">Submit a Contract</h1>
      <p className="mb-8 text-muted">
        Share your safety contract with the community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            placeholder="My Safety Contract"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-mono focus:border-accent focus:outline-none"
            placeholder="my-safety-contract"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            placeholder="What does this contract do?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          >
            <option value="file-safety">File Safety</option>
            <option value="data-protection">Data Protection</option>
            <option value="access-control">Access Control</option>
            <option value="compliance">Compliance</option>
            <option value="rate-limiting">Rate Limiting</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            placeholder="secrets, dlp, safety (comma-separated)"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            YAML Contract
          </label>
          <textarea
            required
            value={yaml}
            onChange={e => setYaml(e.target.value)}
            rows={15}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm focus:border-accent focus:outline-none"
            placeholder="apiVersion: edictum/v1..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent py-3 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Contract'}
        </button>
      </form>
    </div>
  )
}

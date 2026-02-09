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
        <h1 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">
          Submit a Contract
        </h1>
        <p className="mb-6 text-[13px] text-white/40">
          Sign in to submit your safety contract to the hub.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-accent/90">
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

  const inputClasses =
    'w-full rounded-md border border-white/[0.07] bg-[#0c0c0c] px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:border-accent/50 focus:outline-none'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
        Submit a Contract
      </h1>
      <p className="mb-8 text-[13px] text-white/40">
        Share your safety contract with the community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-white/50">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClasses}
            placeholder="My Safety Contract"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-white/50">
            Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className={`${inputClasses} font-mono`}
            placeholder="my-safety-contract"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-white/50">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className={inputClasses}
            placeholder="What does this contract do?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-white/50">
            Category
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={inputClasses}
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
          <label className="mb-1.5 block text-[12px] font-medium text-white/50">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className={inputClasses}
            placeholder="secrets, dlp, safety (comma-separated)"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-white/50">
            YAML Contract
          </label>
          <textarea
            required
            value={yaml}
            onChange={e => setYaml(e.target.value)}
            rows={15}
            className={`${inputClasses} font-mono`}
            placeholder="apiVersion: edictum/v1..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-accent py-2.5 text-[13px] font-medium text-black transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Contract'}
        </button>
      </form>
    </div>
  )
}

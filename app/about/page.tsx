import { Shield, Github, Package } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-4 font-mono text-3xl font-bold">About Edictum</h1>

      <div className="space-y-6 text-muted">
        <p className="text-lg leading-relaxed">
          Edictum is an open-source Python library that provides runtime
          contract enforcement for AI agent tool calls. It works at the
          decision-to-action seam — the moment an agent decides to call a tool,
          but before the call executes.
        </p>

        <p className="leading-relaxed">
          Unlike prompt-based safety measures, Edictum uses deterministic YAML
          contracts that cannot be bypassed by clever prompting. Contracts
          define preconditions, postconditions, and session limits that are
          enforced programmatically.
        </p>

        <p className="leading-relaxed">
          The Edictum Hub is the community registry for sharing and discovering
          safety contracts. Browse official templates, contribute your own, and
          find the right contracts for your agent&apos;s use case.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <a
          href="https://github.com/acartag7/edictum"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/30"
        >
          <Github className="h-6 w-6 text-accent" />
          <div>
            <p className="font-mono text-sm font-semibold">GitHub</p>
            <p className="text-xs text-muted">Source code</p>
          </div>
        </a>
        <a
          href="https://pypi.org/project/edictum/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/30"
        >
          <Package className="h-6 w-6 text-accent" />
          <div>
            <p className="font-mono text-sm font-semibold">PyPI</p>
            <p className="text-xs text-muted">pip install edictum</p>
          </div>
        </a>
        <a
          href="https://acartag7.github.io/edictum/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/30"
        >
          <Shield className="h-6 w-6 text-accent" />
          <div>
            <p className="font-mono text-sm font-semibold">Documentation</p>
            <p className="text-xs text-muted">Full docs site</p>
          </div>
        </a>
      </div>
    </div>
  )
}

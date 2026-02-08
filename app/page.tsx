import Link from 'next/link'
import { Shield, Zap, Lock, Eye, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Deterministic Enforcement',
    description:
      'YAML contracts evaluate at the tool-call boundary. No prompt tricks — real enforcement.',
  },
  {
    icon: Lock,
    title: 'Pre & Post Conditions',
    description:
      'Block dangerous inputs before execution. Scan outputs for PII after. Full pipeline coverage.',
  },
  {
    icon: Eye,
    title: 'Observe Mode',
    description:
      'Shadow-test contracts without blocking. See what would be caught before going enforce.',
  },
  {
    icon: Zap,
    title: '6 Framework Adapters',
    description:
      'LangChain, OpenAI Agents, CrewAI, Agno, Semantic Kernel, Claude SDK. One contract, every framework.',
  },
]

export default function Home() {
  return (
    <div className="dot-pattern">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">v0.5.3</span>
          </div>
          <h1 className="mb-6 font-mono text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Safety contracts for <span className="text-accent">AI agents</span>
          </h1>
          <p className="mb-8 text-lg text-muted sm:text-xl">
            Runtime contract enforcement at the decision-to-action seam. Stop
            agents before they break things.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Browse Contracts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://acartag7.github.io/edictum/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface"
            >
              Read the Docs
            </a>
          </div>
        </div>
      </section>

      {/* Quick install */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <pre className="text-center">
            <code className="text-accent">pip install edictum</code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(feature => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <feature.icon className="mb-3 h-8 w-8 text-accent" />
              <h3 className="mb-2 font-mono text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-mono text-2xl font-bold">
            One contract. Every framework.
          </h2>
          <pre>
            <code>{`apiVersion: edictum/v1
kind: ContractBundle
metadata:
  name: file-agent
defaults:
  mode: enforce
contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret", "credentials"]
    then:
      effect: deny
      message: "Sensitive file blocked."
      tags: [secrets, dlp]`}</code>
          </pre>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-mono text-2xl font-bold">
            Ready to secure your agents?
          </h2>
          <p className="mb-8 text-muted">
            Browse community contracts or submit your own.
          </p>
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
          >
            Explore the Hub
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

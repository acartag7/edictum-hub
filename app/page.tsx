import Link from 'next/link'
import {
  Shield,
  Zap,
  Lock,
  Eye,
  ArrowRight,
  Github,
  ExternalLink,
  Terminal,
  Copy,
} from 'lucide-react'
import { EdictumLogo } from '@/components/edictum-logo'

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

const frameworks = [
  'LangChain',
  'OpenAI Agents',
  'CrewAI',
  'Agno',
  'Semantic Kernel',
  'Claude SDK',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <EdictumLogo size={22} className="text-white/80" />
            <span className="text-[15px] font-semibold tracking-tight text-white/90">
              edictum
            </span>
            <span className="ml-1 rounded-full border border-accent/25 bg-accent/8 px-2 py-0.5 text-[10px] font-medium text-accent/80">
              v0.5.3
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/hub"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              Hub
            </Link>
            <Link
              href="/playground"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              Playground
            </Link>
            <Link
              href="/guides"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              Guides
            </Link>
            <a
              href="https://acartag7.github.io/edictum/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              Docs
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/acartag7/edictum"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 rounded-md p-1.5 text-white/40 transition-colors hover:text-white/70"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0a_70%)]" />

        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
              Runtime contract enforcement
            </p>
            <h1 className="mb-5 text-3xl font-bold tracking-tight text-white/90 sm:text-4xl lg:text-5xl">
              Safety contracts for{' '}
              <span className="text-accent">AI agents</span>
            </h1>
            <p className="mb-8 text-[15px] leading-relaxed text-white/40">
              Declarative YAML contracts that deny dangerous tool calls before
              execution, warn on suspicious output after, and cap session usage
              — all deterministic, no LLM in the loop.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/hub"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
              >
                Browse Contracts
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://acartag7.github.io/edictum/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-[13px] font-medium text-white/70 transition-colors hover:border-white/[0.12] hover:text-white/90"
              >
                Read the Docs
              </a>
            </div>
          </div>

          {/* Install command */}
          <div className="mx-auto mt-12 max-w-sm">
            <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#0c0c0c]/60 px-4 py-2.5">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-white/25" />
              <code className="flex-1 font-mono text-[13px] text-accent/90">
                pip install edictum
              </code>
              <Copy className="h-3.5 w-3.5 shrink-0 cursor-pointer text-white/25 transition-colors hover:text-white/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
            Capabilities
          </p>
          <h2 className="mb-12 text-center text-xl font-bold tracking-tight text-white/85 sm:text-2xl">
            Everything you need to secure agent tool calls
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]/60 p-5"
              >
                <feature.icon className="mb-3 h-5 w-5 text-accent/80" />
                <h3 className="mb-1.5 text-[14px] font-semibold text-white/85">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/40">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract example */}
      <section className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
            How it works
          </p>
          <h2 className="mb-12 text-center text-xl font-bold tracking-tight text-white/85 sm:text-2xl">
            One contract. Every framework.
          </h2>
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-lg border border-white/[0.06]">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0c0c0c] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                </div>
                <span className="ml-2 text-[11px] text-white/25">
                  file-agent.yaml
                </span>
              </div>
              <pre className="border-0 bg-[#0c0c0c]/60 p-5 text-[13px] leading-[1.8]">
                <code>
                  <span className="text-white/30">apiVersion:</span>{' '}
                  <span className="text-accent/80">edictum/v1</span>
                  {'\n'}
                  <span className="text-white/30">kind:</span>{' '}
                  <span className="text-accent/80">ContractBundle</span>
                  {'\n'}
                  <span className="text-white/30">metadata:</span>
                  {'\n'}
                  {'  '}
                  <span className="text-white/30">name:</span>{' '}
                  <span className="text-white/60">file-agent</span>
                  {'\n'}
                  <span className="text-white/30">defaults:</span>
                  {'\n'}
                  {'  '}
                  <span className="text-white/30">mode:</span>{' '}
                  <span className="text-white/60">enforce</span>
                  {'\n'}
                  <span className="text-white/30">contracts:</span>
                  {'\n'}
                  {'  - '}
                  <span className="text-white/30">id:</span>{' '}
                  <span className="text-white/60">block-sensitive-reads</span>
                  {'\n'}
                  {'    '}
                  <span className="text-white/30">type:</span>{' '}
                  <span className="text-accent/70">pre</span>
                  {'\n'}
                  {'    '}
                  <span className="text-white/30">tool:</span>{' '}
                  <span className="text-white/60">read_file</span>
                  {'\n'}
                  {'    '}
                  <span className="text-white/30">when:</span>
                  {'\n'}
                  {'      '}
                  <span className="text-white/30">args.path:</span>
                  {'\n'}
                  {'        '}
                  <span className="text-white/30">contains_any:</span>{' '}
                  <span className="text-white/50">
                    [&quot;.env&quot;, &quot;.secret&quot;,
                    &quot;credentials&quot;]
                  </span>
                  {'\n'}
                  {'    '}
                  <span className="text-white/30">then:</span>
                  {'\n'}
                  {'      '}
                  <span className="text-white/30">effect:</span>{' '}
                  <span className="text-red-400/80">deny</span>
                  {'\n'}
                  {'      '}
                  <span className="text-white/30">message:</span>{' '}
                  <span className="text-white/50">
                    &quot;Sensitive file blocked.&quot;
                  </span>
                </code>
              </pre>
            </div>
          </div>

          {/* Framework pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {frameworks.map(fw => (
              <span
                key={fw}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-white/35"
              >
                {fw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-white/85 sm:text-2xl">
            Ready to secure your agents?
          </h2>
          <p className="mb-8 text-[13px] text-white/40">
            Browse community contracts, test them in the playground, or submit
            your own.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
            >
              Explore the Hub
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-[13px] font-medium text-white/70 transition-colors hover:border-white/[0.12] hover:text-white/90"
            >
              Try the Playground
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <EdictumLogo size={16} className="text-white/30" />
              <span className="text-[12px] text-white/30">
                edictum — safety contracts for AI agents
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/hub"
                className="text-[12px] text-white/30 transition-colors hover:text-white/60"
              >
                Hub
              </Link>
              <Link
                href="/playground"
                className="text-[12px] text-white/30 transition-colors hover:text-white/60"
              >
                Playground
              </Link>
              <Link
                href="/guides"
                className="text-[12px] text-white/30 transition-colors hover:text-white/60"
              >
                Guides
              </Link>
              <a
                href="https://github.com/acartag7/edictum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/30 transition-colors hover:text-white/60"
              >
                GitHub
              </a>
              <a
                href="https://pypi.org/project/edictum/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/30 transition-colors hover:text-white/60"
              >
                PyPI
              </a>
            </div>
            <p className="text-[12px] text-white/30">
              Built by{' '}
              <a
                href="https://github.com/acartag7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 transition-colors hover:text-accent"
              >
                Arnold Cartagena
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import {
  Shield,
  Zap,
  Lock,
  Eye,
  ArrowRight,
  Terminal,
  Copy,
} from 'lucide-react'

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
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-20 sm:px-6 sm:pt-28 sm:pb-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
              Runtime contract enforcement
            </p>
            <h1 className="mb-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Safety contracts for{' '}
              <span className="text-accent">AI agents</span>
            </h1>
            <p className="mb-8 text-[15px] leading-relaxed text-foreground-tertiary">
              Declarative YAML contracts that deny dangerous tool calls before
              execution, warn on suspicious output after, and cap session usage
              — all deterministic, no LLM in the loop.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/hub"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
              >
                Browse Contracts
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://acartag7.github.io/edictum/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-[13px] font-medium text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                Read the Docs
              </a>
            </div>
          </div>

          {/* Install command */}
          <div className="mx-auto mt-12 max-w-sm">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-muted" />
              <code className="flex-1 font-mono text-[13px] text-accent">
                pip install edictum
              </code>
              <Copy className="h-3.5 w-3.5 shrink-0 cursor-pointer text-muted transition-colors hover:text-foreground-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
            Capabilities
          </p>
          <h2 className="mb-12 text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Everything you need to secure agent tool calls
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <feature.icon className="mb-3 h-5 w-5 text-accent" />
                <h3 className="mb-1.5 text-[14px] font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-foreground-tertiary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract example */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
            How it works
          </p>
          <h2 className="mb-12 text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            One contract. Every framework.
          </h2>
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <span className="ml-2 text-[11px] text-muted">
                  file-agent.yaml
                </span>
              </div>
              <pre className="border-0 bg-surface p-5 text-[13px] leading-[1.8]">
                <code>
                  <span className="text-muted">apiVersion:</span>{' '}
                  <span className="text-accent">edictum/v1</span>
                  {'\n'}
                  <span className="text-muted">kind:</span>{' '}
                  <span className="text-accent">ContractBundle</span>
                  {'\n'}
                  <span className="text-muted">metadata:</span>
                  {'\n'}
                  {'  '}
                  <span className="text-muted">name:</span>{' '}
                  <span className="text-foreground-secondary">file-agent</span>
                  {'\n'}
                  <span className="text-muted">defaults:</span>
                  {'\n'}
                  {'  '}
                  <span className="text-muted">mode:</span>{' '}
                  <span className="text-foreground-secondary">enforce</span>
                  {'\n'}
                  <span className="text-muted">contracts:</span>
                  {'\n'}
                  {'  - '}
                  <span className="text-muted">id:</span>{' '}
                  <span className="text-foreground-secondary">
                    block-sensitive-reads
                  </span>
                  {'\n'}
                  {'    '}
                  <span className="text-muted">type:</span>{' '}
                  <span className="text-accent">pre</span>
                  {'\n'}
                  {'    '}
                  <span className="text-muted">tool:</span>{' '}
                  <span className="text-foreground-secondary">read_file</span>
                  {'\n'}
                  {'    '}
                  <span className="text-muted">when:</span>
                  {'\n'}
                  {'      '}
                  <span className="text-muted">args.path:</span>
                  {'\n'}
                  {'        '}
                  <span className="text-muted">contains_any:</span>{' '}
                  <span className="text-foreground-tertiary">
                    [&quot;.env&quot;, &quot;.secret&quot;,
                    &quot;credentials&quot;]
                  </span>
                  {'\n'}
                  {'    '}
                  <span className="text-muted">then:</span>
                  {'\n'}
                  {'      '}
                  <span className="text-muted">effect:</span>{' '}
                  <span className="text-danger">deny</span>
                  {'\n'}
                  {'      '}
                  <span className="text-muted">message:</span>{' '}
                  <span className="text-foreground-tertiary">
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
                className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-muted"
              >
                {fw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Ready to secure your agents?
          </h2>
          <p className="mb-8 text-[13px] text-foreground-tertiary">
            Browse community contracts, test them in the playground, or submit
            your own.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
            >
              Explore the Hub
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-[13px] font-medium text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              Try the Playground
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Play,
  Loader2,
  ChevronDown,
  Terminal,
  FileCode,
  FileText,
  RotateCcw,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Activity,
  Braces,
  LayoutList,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Pyodide types                                                     */
/* ------------------------------------------------------------------ */

interface PyodideInterface {
  loadPackage: (pkg: string) => Promise<void>
  pyimport: (mod: string) => { install: (pkg: string) => Promise<void> }
  runPythonAsync: (code: string) => Promise<unknown>
  FS: {
    writeFile: (path: string, data: string) => void
  }
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>
  }
}

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/'

/* ------------------------------------------------------------------ */
/*  Example data                                                      */
/* ------------------------------------------------------------------ */

interface Example {
  label: string
  description: string
  yaml: string
  python: string
}

const EXAMPLES: Record<string, Example> = {
  'file-agent': {
    label: 'File Agent',
    description: 'Block sensitive file reads and destructive bash commands',
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: file-agent
  description: "Contracts for file-handling agents. Blocks sensitive reads and destructive bash."

defaults:
  mode: enforce

contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret", "kubeconfig", "credentials", ".pem", "id_rsa"]
    then:
      effect: deny
      message: "Sensitive file '{args.path}' blocked."
      tags: [secrets, dlp]

  - id: block-destructive-bash
    type: pre
    tool: bash
    when:
      any:
        - args.command: { matches: '\\\\brm\\\\s+(-rf?|--recursive)\\\\b' }
        - args.command: { matches: '\\\\bmkfs\\\\b' }
        - args.command: { contains: '> /dev/' }
    then:
      effect: deny
      message: "Destructive command blocked: '{args.command}'."
      tags: [destructive, safety]

  - id: block-write-outside-target
    type: pre
    tool: write_file
    when:
      args.path:
        starts_with: /
    then:
      effect: deny
      message: "Write to absolute path '{args.path}' blocked. Use relative paths."
      tags: [write-scope]`,
    python: `from edictum import Edictum, EdictumDenied

guard = Edictum.from_yaml("contracts.yaml")

async def read_file(path):
    return f"Contents of {path}"

# This will be DENIED - .env is a sensitive file
try:
    result = await guard.run(
        "read_file",
        {"path": "/app/.env"},
        read_file,
    )
except EdictumDenied as e:
    print(f"DENIED: {e.reason}")

# This will SUCCEED - safe file
result = await guard.run(
    "read_file",
    {"path": "README.md"},
    read_file,
)
print(f"OK: {result}")`,
  },
  'research-agent': {
    label: 'Research Agent',
    description: 'Session limits and PII detection for research workflows',
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: research-agent
  description: "Contracts for research agents. Rate limits and output caps."

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
      message: "Sensitive file '{args.path}' blocked."
      tags: [secrets]

  - id: pii-in-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b'
    then:
      effect: warn
      message: "PII pattern detected in output. Redact before using."
      tags: [pii, compliance]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 50
      max_attempts: 100
    then:
      effect: deny
      message: "Session limit reached. Summarize progress and stop."
      tags: [rate-limit]`,
    python: `from edictum import Edictum, EdictumDenied

guard = Edictum.from_yaml("contracts.yaml")

async def search(query):
    return f"Results for: {query}"

async def read_file(path):
    return f"Contents of {path}"

# This will be DENIED - credentials is sensitive
try:
    result = await guard.run(
        "read_file",
        {"path": "credentials.json"},
        read_file,
    )
except EdictumDenied as e:
    print(f"DENIED: {e.reason}")

# This will SUCCEED
result = await guard.run(
    "search",
    {"query": "python async patterns"},
    search,
)
print(f"OK: {result}")`,
  },
  'devops-agent': {
    label: 'DevOps Agent',
    description:
      'Production deploy gates, ticket requirements, and role checks',
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: devops-agent
  description: "Contracts for DevOps agents. Prod gates, ticket requirements, PII detection."

defaults:
  mode: enforce

contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret", "kubeconfig", "credentials", ".pem", "id_rsa"]
    then:
      effect: deny
      message: "Sensitive file '{args.path}' blocked."
      tags: [secrets, dlp]

  - id: block-destructive-bash
    type: pre
    tool: bash
    when:
      any:
        - args.command: { matches: '\\\\brm\\\\s+(-rf?|--recursive)\\\\b' }
        - args.command: { matches: '\\\\bmkfs\\\\b' }
        - args.command: { contains: '> /dev/' }
    then:
      effect: deny
      message: "Destructive command blocked: '{args.command}'."
      tags: [destructive, safety]

  - id: prod-deploy-requires-senior
    type: pre
    tool: deploy_service
    when:
      all:
        - environment: { equals: production }
        - principal.role: { not_in: [senior_engineer, sre, admin] }
    then:
      effect: deny
      message: "Production deploys require senior role (sre/admin)."
      tags: [change-control, production]

  - id: prod-requires-ticket
    type: pre
    tool: deploy_service
    when:
      all:
        - environment: { equals: production }
        - principal.ticket_ref: { exists: false }
    then:
      effect: deny
      message: "Production changes require a ticket reference."
      tags: [change-control, compliance]

  - id: pii-in-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b'
    then:
      effect: warn
      message: "PII pattern detected in output. Redact before using."
      tags: [pii, compliance]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 20
      max_attempts: 50
    then:
      effect: deny
      message: "Session limit reached. Summarize progress and stop."
      tags: [rate-limit]`,
    python: `from edictum import Edictum, EdictumDenied, Principal

guard = Edictum.from_yaml("contracts.yaml")

async def deploy_service(env, version):
    return f"Deployed v{version} to {env}"

# DENIED - junior role deploying to prod
try:
    result = await guard.run(
        "deploy_service",
        {"env": "production", "version": "2.1.0"},
        deploy_service,
        environment="production",
        principal=Principal(role="junior_engineer"),
    )
except EdictumDenied as e:
    print(f"DENIED: {e.reason}")

# DENIED - no ticket ref for prod
try:
    result = await guard.run(
        "deploy_service",
        {"env": "production", "version": "2.1.0"},
        deploy_service,
        environment="production",
        principal=Principal(role="sre"),
    )
except EdictumDenied as e:
    print(f"DENIED: {e.reason}")

# SUCCESS - senior role + ticket
result = await guard.run(
    "deploy_service",
    {"env": "production", "version": "2.1.0"},
    deploy_service,
    environment="production",
    principal=Principal(
        role="sre",
        ticket_ref="JIRA-1234",
    ),
)
print(f"OK: {result}")`,
  },
}

const EXAMPLE_KEYS = Object.keys(EXAMPLES)

/* ------------------------------------------------------------------ */
/*  Loading status                                                    */
/* ------------------------------------------------------------------ */

type LoadingStage =
  | 'idle'
  | 'loading-pyodide'
  | 'installing-packages'
  | 'ready'
  | 'running'
  | 'error'

const STAGE_LABELS: Record<LoadingStage, string> = {
  idle: 'Not loaded',
  'loading-pyodide': 'Loading Pyodide runtime...',
  'installing-packages': 'Installing edictum[yaml]...',
  ready: 'Ready',
  running: 'Running...',
  error: 'Error',
}

/* ------------------------------------------------------------------ */
/*  Output parser                                                     */
/* ------------------------------------------------------------------ */

interface AuditEvent {
  action: string
  tool_name: string
  reason: string | null
  decision_source: string | null
  decision_name: string | null
  tool_success: boolean | null
  contracts_evaluated: {
    name: string
    type: string
    passed: boolean
    message: string | null
  }[]
}

type OutputLine =
  | { type: 'audit'; event: AuditEvent }
  | { type: 'text'; text: string }

function parseOutputLines(raw: string): OutputLine[] {
  const lines = raw.split('\n')
  const result: OutputLine[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed.schema_version && parsed.action) {
          result.push({ type: 'audit', event: parsed as AuditEvent })
          continue
        }
      } catch {
        /* not JSON, treat as text */
      }
    }
    result.push({ type: 'text', text: line })
  }

  return result
}

function AuditEventCard({ event }: { event: AuditEvent }) {
  const isDenied = event.action === 'call_denied'
  const isAllowed = event.action === 'call_allowed'
  const isExecuted = event.action === 'call_executed'
  const isWouldDeny = event.action === 'call_would_deny'
  const isWarning = event.action === 'postcondition_warning'

  const Icon =
    isDenied || isWouldDeny
      ? ShieldX
      : isWarning
        ? ShieldAlert
        : isAllowed || isExecuted
          ? ShieldCheck
          : Activity

  const colorClass =
    isDenied || isWouldDeny
      ? 'text-red-400 border-red-400/20 bg-red-400/[0.04]'
      : isWarning
        ? 'text-amber-400 border-amber-400/20 bg-amber-400/[0.04]'
        : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/[0.04]'

  const actionLabel =
    {
      call_denied: 'DENIED',
      call_would_deny: 'WOULD DENY',
      call_allowed: 'ALLOWED',
      call_executed: 'EXECUTED',
      call_failed: 'FAILED',
      postcondition_warning: 'WARNING',
    }[event.action] ?? event.action.toUpperCase()

  return (
    <div
      className={`flex items-start gap-2.5 rounded-md border px-3 py-2 ${colorClass}`}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {actionLabel}
          </span>
          <span className="font-mono text-[11px] text-white/50">
            {event.tool_name}()
            {event.decision_name ? ` → ${event.decision_name}` : ''}
          </span>
        </div>
        {event.reason && (
          <p className="mt-0.5 text-[12px] text-white/60">{event.reason}</p>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  jq-style JSON colorizer                                           */
/* ------------------------------------------------------------------ */

function colorizeJson(json: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  /* Match strings, numbers, booleans, null, and structural chars */
  const re =
    /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|(true|false)|(null)|([{}[\],:])/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(json)) !== null) {
    /* Whitespace/newlines between tokens */
    if (match.index > lastIndex) {
      nodes.push(json.slice(lastIndex, match.index))
    }

    const [full, key, str, num, bool, nul] = match

    if (key) {
      /* Object key */
      nodes.push(
        <span key={`k${match.index}`} className="text-sky-300">
          {key}
        </span>
      )
      nodes.push(': ')
    } else if (str) {
      nodes.push(
        <span key={`s${match.index}`} className="text-emerald-400">
          {str}
        </span>
      )
    } else if (num) {
      nodes.push(
        <span key={`n${match.index}`} className="text-purple-400">
          {num}
        </span>
      )
    } else if (bool) {
      nodes.push(
        <span key={`b${match.index}`} className="text-amber-400">
          {bool}
        </span>
      )
    } else if (nul) {
      nodes.push(
        <span key={`u${match.index}`} className="text-red-400/70">
          {nul}
        </span>
      )
    } else {
      /* structural: { } [ ] , : */
      nodes.push(
        <span key={`p${match.index}`} className="text-white/30">
          {full}
        </span>
      )
    }
    lastIndex = match.index + full.length
  }

  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex))
  }

  return nodes
}

function JsonOutputView({ raw }: { raw: string }) {
  const lines = raw.split('\n')
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        if (trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed)
            if (parsed.schema_version && parsed.action) {
              const pretty = JSON.stringify(parsed, null, 2)
              return (
                <pre
                  key={i}
                  className="whitespace-pre-wrap rounded-md border border-white/[0.05] bg-white/[0.02] p-3 font-mono text-[11px] leading-relaxed"
                >
                  {colorizeJson(pretty)}
                </pre>
              )
            }
          } catch {
            /* not JSON */
          }
        }
        return (
          <pre
            key={i}
            className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-white/75"
          >
            {line}
          </pre>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PlaygroundPage() {
  const [stage, setStage] = useState<LoadingStage>('idle')
  const [selectedExample, setSelectedExample] = useState(EXAMPLE_KEYS[0])
  const [yamlContent, setYamlContent] = useState(EXAMPLES[EXAMPLE_KEYS[0]].yaml)
  const [pythonCode, setPythonCode] = useState(EXAMPLES[EXAMPLE_KEYS[0]].python)
  const [output, setOutput] = useState('')
  const [rawJson, setRawJson] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const pyodideRef = useRef<PyodideInterface | null>(null)
  const scriptLoadedRef = useRef(false)

  /* ---- Load Pyodide ---- */

  const loadPyodideRuntime = useCallback(async () => {
    if (pyodideRef.current) return
    setErrorMsg('')

    try {
      /* Load the script if not already present */
      if (!scriptLoadedRef.current && !window.loadPyodide) {
        setStage('loading-pyodide')
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = `${PYODIDE_CDN}pyodide.js`
          script.onload = () => {
            scriptLoadedRef.current = true
            resolve()
          }
          script.onerror = () => reject(new Error('Failed to load Pyodide'))
          document.head.appendChild(script)
        })
      } else {
        setStage('loading-pyodide')
      }

      const pyodide = await window.loadPyodide!({ indexURL: PYODIDE_CDN })

      /* Install edictum */
      setStage('installing-packages')
      await pyodide.loadPackage('micropip')
      const micropip = pyodide.pyimport('micropip')
      await micropip.install('edictum[yaml]')

      pyodideRef.current = pyodide
      setStage('ready')
    } catch (err) {
      setStage('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load Pyodide')
    }
  }, [])

  /* Auto-load on mount */
  useEffect(() => {
    loadPyodideRuntime()
  }, [loadPyodideRuntime])

  /* ---- Select example ---- */

  const selectExample = useCallback((key: string) => {
    setSelectedExample(key)
    setYamlContent(EXAMPLES[key].yaml)
    setPythonCode(EXAMPLES[key].python)
    setOutput('')
    setDropdownOpen(false)
  }, [])

  /* ---- Run code ---- */

  const runCode = useCallback(async () => {
    const pyodide = pyodideRef.current
    if (!pyodide) return

    setStage('running')
    setOutput('')
    setErrorMsg('')

    try {
      /* Write YAML to virtual FS */
      pyodide.FS.writeFile('contracts.yaml', yamlContent)

      /* Capture stdout/stderr */
      await pyodide.runPythonAsync(`
import sys, io
_edictum_stdout = io.StringIO()
_edictum_stderr = io.StringIO()
sys.stdout = _edictum_stdout
sys.stderr = _edictum_stderr
`)

      /* Run user code */
      let runError: string | null = null
      try {
        await pyodide.runPythonAsync(pythonCode)
      } catch (err) {
        runError = err instanceof Error ? err.message : String(err)
      }

      /* Read captured output */
      const stdout = await pyodide.runPythonAsync('_edictum_stdout.getvalue()')
      const stderr = await pyodide.runPythonAsync('_edictum_stderr.getvalue()')

      /* Reset stdout/stderr */
      await pyodide.runPythonAsync(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)

      const parts = [
        stdout ? String(stdout) : '',
        stderr ? String(stderr) : '',
        runError ?? '',
      ].filter(Boolean)

      setOutput(parts.join('\n') || '(no output)')
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'An error occurred during execution'
      setOutput(msg)
    } finally {
      setStage('ready')
    }
  }, [yamlContent, pythonCode])

  /* ---- Reset ---- */

  const resetExample = useCallback(() => {
    setYamlContent(EXAMPLES[selectedExample].yaml)
    setPythonCode(EXAMPLES[selectedExample].python)
    setOutput('')
  }, [selectedExample])

  /* ---- Helpers ---- */

  const isReady = stage === 'ready'
  const isLoading =
    stage === 'loading-pyodide' || stage === 'installing-packages'

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
          Playground
        </h1>
        <p className="text-[13px] text-white/40">
          Test Edictum contracts in your browser with a live Python runtime
          powered by Pyodide.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Example selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-[#0c0c0c] px-3 py-1.5 text-[13px] text-white/70 transition-colors hover:border-white/[0.12] hover:text-white/85"
          >
            <FileText className="h-3.5 w-3.5 text-accent/70" />
            {EXAMPLES[selectedExample].label}
            <ChevronDown className="h-3 w-3 text-white/35" />
          </button>
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-white/[0.07] bg-[#111] py-1 shadow-xl">
                {EXAMPLE_KEYS.map(key => (
                  <button
                    key={key}
                    onClick={() => selectExample(key)}
                    className={`w-full px-3 py-2 text-left transition-colors hover:bg-white/[0.04] ${
                      selectedExample === key ? 'text-accent' : 'text-white/70'
                    }`}
                  >
                    <div className="text-[13px] font-medium">
                      {EXAMPLES[key].label}
                    </div>
                    <div className="text-[11px] text-white/35">
                      {EXAMPLES[key].description}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Reset button */}
        <button
          onClick={resetExample}
          className="flex items-center gap-1.5 rounded-md border border-white/[0.07] px-3 py-1.5 text-[12px] text-white/40 transition-colors hover:border-white/[0.12] hover:text-white/60"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>

        <div className="flex-1" />

        {/* Status */}
        <div className="flex items-center gap-2 text-[11px]">
          {isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-accent" />
          )}
          {stage === 'running' && (
            <Loader2 className="h-3 w-3 animate-spin text-accent" />
          )}
          {stage === 'ready' && (
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          )}
          {stage === 'error' && (
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          )}
          <span className="text-white/35">{STAGE_LABELS[stage]}</span>
        </div>

        {/* Run button */}
        <button
          onClick={runCode}
          disabled={!isReady}
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-1.5 text-[13px] font-medium text-black transition-opacity disabled:opacity-40"
        >
          {stage === 'running' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          Run
        </button>
      </div>

      {/* Editor panes */}
      <div className="grid gap-3 lg:grid-cols-2">
        {/* YAML pane */}
        <div className="flex flex-col rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
            <FileText className="h-3.5 w-3.5 text-accent/60" />
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
              Contract YAML
            </span>
          </div>
          <textarea
            value={yamlContent}
            onChange={e => setYamlContent(e.target.value)}
            spellCheck={false}
            className="min-h-[380px] flex-1 resize-y bg-transparent p-3 font-mono text-[12px] leading-relaxed text-white/75 placeholder:text-white/20 focus:outline-none"
          />
        </div>

        {/* Python pane */}
        <div className="flex flex-col rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
            <FileCode className="h-3.5 w-3.5 text-accent/60" />
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
              Python Code
            </span>
          </div>
          <textarea
            value={pythonCode}
            onChange={e => setPythonCode(e.target.value)}
            spellCheck={false}
            className="min-h-[380px] flex-1 resize-y bg-transparent p-3 font-mono text-[12px] leading-relaxed text-white/75 placeholder:text-white/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Output panel */}
      <div className="mt-3 rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
          <Terminal className="h-3.5 w-3.5 text-accent/60" />
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent/80">
            Output
          </span>
          <div className="flex-1" />
          {output && (
            <div className="flex items-center rounded-md border border-white/[0.07] p-0.5">
              <button
                onClick={() => setRawJson(false)}
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors ${
                  !rawJson
                    ? 'bg-white/[0.08] text-white/80'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                <LayoutList className="h-3 w-3" />
                Formatted
              </button>
              <button
                onClick={() => setRawJson(true)}
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors ${
                  rawJson
                    ? 'bg-white/[0.08] text-white/80'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                <Braces className="h-3 w-3" />
                JSON
              </button>
            </div>
          )}
        </div>
        <div className="min-h-[120px] p-3">
          {isLoading && (
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-accent/60" />
              <div>
                <p className="text-[13px] text-white/60">
                  {STAGE_LABELS[stage]}
                </p>
                <p className="text-[11px] text-white/25">
                  {stage === 'loading-pyodide'
                    ? 'Downloading Python runtime (~10 MB)'
                    : 'Installing edictum and dependencies from PyPI'}
                </p>
              </div>
            </div>
          )}
          {stage === 'error' && errorMsg && (
            <p className="font-mono text-[12px] text-red-400">{errorMsg}</p>
          )}
          {!isLoading && stage !== 'error' && !output && (
            <p className="text-[12px] text-white/20">
              {isReady
                ? 'Click Run to execute the Python code.'
                : 'Waiting for runtime...'}
            </p>
          )}
          {output && rawJson && <JsonOutputView raw={output} />}
          {output && !rawJson && (
            <div className="space-y-2">
              {parseOutputLines(output).map((line, i) =>
                line.type === 'audit' ? (
                  <AuditEventCard key={i} event={line.event} />
                ) : (
                  <pre
                    key={i}
                    className="whitespace-pre-wrap border-0 bg-transparent p-0 font-mono text-[12px] leading-relaxed text-white/75"
                  >
                    {line.text}
                  </pre>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

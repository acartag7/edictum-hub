export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-mono text-3xl font-bold">Playground</h1>
      <p className="mb-8 text-muted">
        Test Edictum contracts in your browser with a live Python runtime.
      </p>

      <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-border bg-surface">
        <div className="text-center">
          <p className="mb-2 font-mono text-lg text-muted">
            Loading playground...
          </p>
          <p className="text-sm text-muted/60">
            {/* TODO: Integrate Pyodide for in-browser Python execution */}
            Pyodide integration coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}

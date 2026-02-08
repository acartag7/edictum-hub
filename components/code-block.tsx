interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({
  code,
  language = 'yaml',
  filename,
}: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {filename && (
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
          <span className="text-xs font-mono text-muted">{filename}</span>
          <span className="text-xs text-muted/50">{language}</span>
        </div>
      )}
      <pre className="!rounded-none !border-0 !m-0">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

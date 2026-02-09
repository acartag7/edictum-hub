'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-white/25 transition-colors hover:text-white/50"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

function CodeBlockRenderer({
  code,
  language,
}: {
  code: string
  language: string
}) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-white/[0.07] bg-[#0c0c0c]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
          </div>
          <span className="font-mono text-[11px] text-white/35">
            {language}
          </span>
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="!m-0 !rounded-none !border-0 overflow-x-auto p-4">
        <code className="font-mono text-[12.5px] leading-[1.65] text-white/65">
          {code}
        </code>
      </pre>
    </div>
  )
}

type Block =
  | { type: 'code'; language: string; code: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: 'code', language, code: codeLines.join('\n') })
      i++ // skip closing ```
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      })
      i++
      continue
    }

    // Unordered list
    if (line.match(/^[-*]\s+/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items.push(lines[i].replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', ordered: false, items })
      continue
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    // Blank line — skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph — collect consecutive non-empty lines
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```') &&
      !lines[i].match(/^#{1,4}\s+/) &&
      !lines[i].match(/^[-*]\s+/) &&
      !lines[i].match(/^\d+\.\s+/)
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
    }
  }

  return blocks
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Match: inline code, bold, italic, links
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const m = match[0]

    if (m.startsWith('`')) {
      // Inline code
      nodes.push(
        <code
          key={match.index}
          className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-white/60"
        >
          {m.slice(1, -1)}
        </code>
      )
    } else if (m.startsWith('**')) {
      // Bold
      nodes.push(
        <strong key={match.index} className="font-semibold text-white/65">
          {m.slice(2, -2)}
        </strong>
      )
    } else if (m.startsWith('*')) {
      // Italic
      nodes.push(
        <em key={match.index} className="italic">
          {m.slice(1, -1)}
        </em>
      )
    } else if (m.startsWith('[')) {
      // Link
      const linkMatch = m.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        const isExternal =
          linkMatch[2].startsWith('http://') ||
          linkMatch[2].startsWith('https://')
        nodes.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            className="text-accent hover:underline"
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {linkMatch[1]}
          </a>
        )
      }
    }

    lastIndex = match.index + m.length
  }

  // Remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = parseBlocks(content)

  return (
    <div className="max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'code':
            return (
              <CodeBlockRenderer
                key={i}
                code={block.code}
                language={block.language}
              />
            )

          case 'heading': {
            const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4'
            const styles: Record<number, string> = {
              1: 'text-xl font-bold text-white/85 mt-8 mb-4',
              2: 'text-lg font-bold text-white/85 mt-6 mb-3',
              3: 'text-[14px] font-semibold text-white/85 mt-4 mb-2',
              4: 'text-[13px] font-semibold text-white/85 mt-3 mb-2',
            }
            return (
              <Tag key={i} className={styles[block.level]}>
                {renderInline(block.text)}
              </Tag>
            )
          }

          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul'
            return (
              <ListTag
                key={i}
                className={`mb-3 pl-6 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
              >
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-[13px] leading-relaxed text-white/40"
                  >
                    {renderInline(item)}
                  </li>
                ))}
              </ListTag>
            )
          }

          case 'paragraph':
            return (
              <p
                key={i}
                className="mb-3 text-[13px] leading-relaxed text-white/40"
              >
                {renderInline(block.text)}
              </p>
            )
        }
      })}
    </div>
  )
}

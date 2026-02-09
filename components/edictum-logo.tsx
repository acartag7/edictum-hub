/**
 * Edictum Logo — Document Temple variant
 *
 * A document with folded corner, temple pillars, circuit pins,
 * and check/X marks. Structural elements use currentColor,
 * accent elements use the --accent CSS variable.
 */
export function EdictumLogo({
  size = 24,
  className,
}: {
  size?: number
  className?: string
}) {
  const accent = 'var(--accent, #f59e0b)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document body with fold */}
      <path
        d="M5 5a2 2 0 012-2h14l6 6v18a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Fold triangle */}
      <path
        d="M21 3v4a2 2 0 002 2h4"
        stroke={accent}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Left pillar */}
      <line
        x1="13"
        y1="12"
        x2="13"
        y2="22"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Right pillar */}
      <line
        x1="19"
        y1="12"
        x2="19"
        y2="22"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Top beam */}
      <line
        x1="11"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Middle beam */}
      <line
        x1="11"
        y1="17"
        x2="21"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Left circuit pins */}
      <line
        x1="1"
        y1="14"
        x2="5"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="1" cy="14" r="1.5" fill="currentColor" />
      <line
        x1="1"
        y1="20"
        x2="5"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="1" cy="20" r="1.5" fill="currentColor" />
      {/* Right circuit pins */}
      <line
        x1="27"
        y1="14"
        x2="31"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="31" cy="14" r="1.5" fill="currentColor" />
      <line
        x1="27"
        y1="20"
        x2="31"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="31" cy="20" r="1.5" fill="currentColor" />
      {/* Check at bottom-left */}
      <polyline
        points="10,24 11.5,26 13.5,23"
        stroke={accent}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* X at bottom-right */}
      <line
        x1="18.5"
        y1="23"
        x2="21"
        y2="26"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="23"
        x2="18.5"
        y2="26"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

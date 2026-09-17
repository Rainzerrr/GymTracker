import type { ReactNode } from 'react'
import { IconChip } from '@shared/atoms/icon-chip'
import { ListRow } from '@shared/molecules/list-row'
import type { SessionHighlightIcon, SessionHighlightsProps } from './session-highlights.types'
import './session-highlights.scss'

const ICONS: Record<SessionHighlightIcon, ReactNode> = {
  star: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 6 L29 19 L43 19 L32 28 L36 42 L24 34 L12 42 L16 28 L5 19 L19 19 Z"
        stroke="currentColor"
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 38 L24 10" />
        <path d="M13 21 L24 10 L35 21" />
      </g>
    </svg>
  ),
  streak: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.5-2-1-2 1 3-1 4-2 4a2 2 0 01-2-2c0-3 3-4 2-9z" />
    </svg>
  ),
}

export const SessionHighlights = ({ highlights }: SessionHighlightsProps) => {
  return (
    <div className="session-highlights">
      {highlights.map((highlight) => (
        <ListRow
          key={highlight.id}
          leading={<IconChip icon={ICONS[highlight.icon]} />}
          title={highlight.title}
          subtitle={highlight.subtitle}
          trailing={
            highlight.xpValue === undefined ? undefined : (
              <span className="session-highlights__xp-tag">+{highlight.xpValue}</span>
            )
          }
        />
      ))}
    </div>
  )
}

export type SessionHighlightIcon = 'star' | 'up' | 'streak'

export type SessionHighlight = {
  id: string
  icon: SessionHighlightIcon
  title: string
  subtitle: string
  xpValue?: number
}

export type SessionHighlightsProps = {
  highlights: SessionHighlight[]
}

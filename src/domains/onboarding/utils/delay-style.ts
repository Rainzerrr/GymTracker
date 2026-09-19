import type { CSSProperties } from 'react'

// Décale le départ d'une animation CSS (lue via `var(--onboarding-delay)`) pour les faire arriver
// l'une après l'autre.
export const delayStyle = (seconds: number): CSSProperties =>
  ({ '--onboarding-delay': `${seconds}s` }) as CSSProperties

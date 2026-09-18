import type { Tier, TierSubLevel } from './tier'

export type RankedItemRecord = {
  id: string
  tier: Tier
  subLevel: TierSubLevel
  progressPercent: number
}

export type NextRankTarget = {
  value: number
  remaining: number
  unit: 'kg' | 'reps' | 'seconds'
  // Pour les exercices à deux haltères : charge à tenir dans chaque main
  perHand?: number
  // Charge totale qui inclut le poids de corps (tractions lestées, dips, pompes…)
  includesBodyweight?: boolean
}

export type RankedItem = {
  id: string
  name: string
  tier: Tier
  subLevel: TierSubLevel
  progressPercent: number
  photoUrl?: string
  nextRankTarget?: NextRankTarget | null
}

export type TierCount = {
  tier: Tier
  count: number
}

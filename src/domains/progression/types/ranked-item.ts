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
  unit: 'kg' | 'reps'
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

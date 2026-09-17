import { TIERS } from '../types/tier'
import type { Tier, TierSubLevel } from '../types/tier'

export type RankResult = {
  tier: Tier
  subLevel: TierSubLevel
  progressPercent: number
}

const TIER_SPAN = 25

/**
 * Score is the % improvement between the first ever recorded performance
 * and the best one, so exercises are ranked against the user's own baseline
 * rather than an arbitrary absolute weight.
 */
export const computeImprovementScore = (chronologicalValues: number[]): number => {
  if (chronologicalValues.length === 0) {
    return 0
  }

  const baseline = chronologicalValues[0]
  const best = Math.max(...chronologicalValues)

  if (baseline <= 0) {
    return 0
  }

  return Math.max(0, ((best - baseline) / baseline) * 100)
}

export const computeRankFromScore = (score: number): RankResult => {
  const clamped = Math.max(0, Math.min(100, score))
  const tierIndex = Math.min(TIERS.length - 1, Math.floor(clamped / TIER_SPAN))
  const tierLocal = clamped - tierIndex * TIER_SPAN
  const subLevel = Math.min(3, Math.floor(tierLocal / (TIER_SPAN / 3)) + 1) as TierSubLevel
  const progressPercent = Math.min(100, Math.round((tierLocal / TIER_SPAN) * 100))

  return { tier: TIERS[tierIndex], subLevel, progressPercent }
}

import { TIERS } from '../types/tier'
import type { RankedItem } from '../types/ranked-item'

export const sortByTier = (items: RankedItem[]): RankedItem[] => {
  return [...items].sort((a, b) => {
    const tierDelta = TIERS.indexOf(b.tier) - TIERS.indexOf(a.tier)
    if (tierDelta !== 0) return tierDelta

    return b.subLevel - a.subLevel
  })
}

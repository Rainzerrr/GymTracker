import { TIERS } from '../types/tier'
import type { TierCount } from '../types/ranked-item'

export const countByTier = (items: { tier: string }[]): TierCount[] => {
  return [...TIERS]
    .reverse()
    .map((tier) => ({ tier, count: items.filter((item) => item.tier === tier).length }))
    .filter((entry) => entry.count > 0)
}

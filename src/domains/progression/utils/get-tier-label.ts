import type { Tier } from '../types/tier'

const TIER_LABELS: Record<Tier, string> = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
  platine: 'Platine',
}

export const getTierLabel = (tier: Tier): string => TIER_LABELS[tier]

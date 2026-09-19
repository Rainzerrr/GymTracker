import { TIERS } from '../types/tier'
import type { Tier, TierSubLevel } from '../types/tier'

export type LadderStepStatus = 'achieved' | 'current' | 'locked'

export type LadderStep = {
  tier: Tier
  subLevel: TierSubLevel
  status: LadderStepStatus
}

const SUB_LEVELS: TierSubLevel[] = [1, 2, 3]

/**
 * Builds the full 12-step ladder (4 tiers × 3 sub-levels), ordered from the
 * strongest step (index 0) to the weakest (last index) so callers can render
 * it top-to-bottom directly.
 */
export const buildTierLadder = (currentTier: Tier, currentSubLevel: TierSubLevel): LadderStep[] => {
  const ascendingSteps = TIERS.flatMap((tier) => SUB_LEVELS.map((subLevel) => ({ tier, subLevel })))

  const currentIndex = ascendingSteps.findIndex(
    (step) => step.tier === currentTier && step.subLevel === currentSubLevel,
  )

  return ascendingSteps
    .map((step, index) => ({
      ...step,
      status: (index < currentIndex
        ? 'achieved'
        : index === currentIndex
          ? 'current'
          : 'locked') as LadderStepStatus,
    }))
    .reverse()
}

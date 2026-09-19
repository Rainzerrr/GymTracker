import type { RirValue } from '@domains/seance-active/types/rir-value'
import type { RepRange } from '@domains/seances/utils/parse-rep-range'

export type TargetSet = { weight: number; reps: number; rir: RirValue | null }

// `repeat` : on rejoue la même chose · `more-reps` : même charge, une rep de plus ·
// `more-weight` : haut de fourchette atteint, on monte la charge · `consolidate` : haut de
// fourchette atteint mais au bout de l'effort, on confirme avant de monter.
export type TargetReason = 'repeat' | 'more-reps' | 'more-weight' | 'consolidate'

export type NextTarget = { weight: number; reps: number; reason: TargetReason }

type SuggestNextTargetInput = {
  lastSets: TargetSet[]
  repRange: RepRange | null
  weightIncrement: number
  isBodyweight: boolean
}

// Toutes les séries à la charge de travail avec au moins 3 reps en réserve : le saut peut doubler.
const EASY_RIR = 3

const roundToHalfKilo = (value: number) => Math.round(value * 2) / 2

const rirToNumber = (rir: RirValue): number => (rir === 'echec' ? 0 : Number(rir))

/**
 * Double progression : on garde la charge tant que la fourchette de reps n'est pas atteinte sur
 * toutes les séries de travail, puis on monte la charge et on repart du bas de la fourchette. Le
 * RIR module le saut, un échec le suspend. Seules les séries à la charge la plus haute comptent
 * (les séries plus légères sont des back-off). `null` si la dernière séance n'a aucune série valide.
 */
export const suggestNextTarget = ({
  lastSets,
  repRange,
  weightIncrement,
  isBodyweight,
}: SuggestNextTargetInput): NextTarget | null => {
  const workSets = lastSets.filter((set) => set.reps > 0)

  if (workSets.length === 0) {
    return null
  }

  const topWeight = isBodyweight ? 0 : Math.max(...workSets.map((set) => set.weight))
  const topSets = workSets.filter((set) => isBodyweight || set.weight === topWeight)
  const lowestReps = Math.min(...topSets.map((set) => set.reps))

  if (!repRange) {
    const bestReps = Math.max(...topSets.map((set) => set.reps))

    return { weight: topWeight, reps: bestReps, reason: 'repeat' }
  }

  if (lowestReps < repRange.min) {
    return { weight: topWeight, reps: repRange.min, reason: 'repeat' }
  }

  if (lowestReps < repRange.max) {
    return { weight: topWeight, reps: lowestReps + 1, reason: 'more-reps' }
  }

  if (isBodyweight) {
    return { weight: 0, reps: lowestReps + 1, reason: 'more-reps' }
  }

  if (topSets.some((set) => set.rir === 'echec')) {
    return { weight: topWeight, reps: repRange.max, reason: 'consolidate' }
  }

  const isEasy = topSets.every((set) => set.rir !== null && rirToNumber(set.rir) >= EASY_RIR)
  const jump = isEasy ? weightIncrement * 2 : weightIncrement

  return { weight: roundToHalfKilo(topWeight + jump), reps: repRange.min, reason: 'more-weight' }
}

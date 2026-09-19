import type { TFunction } from 'i18next'
import type { NextTarget, TargetSet } from '@domains/progression/utils/suggest-next-target'

const formatNumber = (value: number) => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })

// Séries consécutives à la même charge : « 80 kg × 8, 8, 7 · 85 kg × 6 ».
const groupByWeight = (sets: TargetSet[]) =>
  sets.reduce<{ weight: number; reps: number[] }[]>((groups, set) => {
    const last = groups[groups.length - 1]

    if (last && last.weight === set.weight) {
      last.reps.push(set.reps)
    } else {
      groups.push({ weight: set.weight, reps: [set.reps] })
    }

    return groups
  }, [])

export const formatLastSets = (t: TFunction<'seanceActive'>, sets: TargetSet[]): string => {
  const hasWeight = sets.some((set) => set.weight > 0)

  if (!hasWeight) {
    return t('lastSetsReps', { reps: sets.map((set) => set.reps).join(', ') })
  }

  const summary = groupByWeight(sets)
    .map((group) => `${formatNumber(group.weight)} kg × ${group.reps.join(', ')}`)
    .join(' · ')

  return t('lastSets', { sets: summary })
}

const WEIGHTED_KEYS = {
  repeat: 'target.repeat',
  'more-reps': 'target.moreReps',
  'more-weight': 'target.moreWeight',
  consolidate: 'target.consolidate',
} as const

const BODYWEIGHT_KEYS = {
  repeat: 'targetReps.repeat',
  'more-reps': 'targetReps.moreReps',
  'more-weight': 'targetReps.repeat',
  consolidate: 'targetReps.repeat',
} as const

export const formatNextTarget = (
  t: TFunction<'seanceActive'>,
  target: NextTarget,
  isBodyweight: boolean,
): string => {
  const values = { weight: formatNumber(target.weight), reps: target.reps }

  return isBodyweight
    ? t(BODYWEIGHT_KEYS[target.reason], values)
    : t(WEIGHTED_KEYS[target.reason], values)
}

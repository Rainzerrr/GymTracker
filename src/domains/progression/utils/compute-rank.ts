import { STANDARDS_REFERENCE_BODY_WEIGHT_KG, STRENGTH_STANDARDS } from '../data/strength-standards'
import { TIERS } from '../types/tier'
import type { Tier, TierSubLevel } from '../types/tier'
import type { NextRankTarget } from '../types/ranked-item'
import type { StandardLevels, StrengthStandard } from '../types/strength-standard'

export type RankResult = {
  tier: Tier
  subLevel: TierSubLevel
  progressPercent: number
}

export type ExerciseSetPoint = {
  weight: number
  reps: number
}

export type ExerciseRank = RankResult & {
  // Position continue sur l'échelle de 12 paliers (0 = début de Bronze I, 12 = Platine III atteint)
  score: number
  nextRankTarget: NextRankTarget | null
}

const STEPS_PER_TIER = 3
const TOTAL_STEPS = TIERS.length * STEPS_PER_TIER
// En dessous de la moitié du niveau « Débutant », on reste en début de Bronze I
const ENTRY_RATIO = 0.5
const EPLEY_DIVISOR = 30

export const rankFromScore = (score: number): RankResult => {
  const clamped = Math.max(0, Math.min(TOTAL_STEPS, score))
  const tierIndex = Math.min(TIERS.length - 1, Math.floor(clamped / STEPS_PER_TIER))
  const tierLocal = clamped - tierIndex * STEPS_PER_TIER
  const subLevel = Math.min(3, Math.floor(tierLocal) + 1) as TierSubLevel
  const progressPercent = Math.min(100, Math.round((tierLocal / STEPS_PER_TIER) * 100))

  return { tier: TIERS[tierIndex], subLevel, progressPercent }
}

/**
 * 13 bornes pour 12 paliers : Bronze démarre sous le niveau « Débutant », Argent au « Novice »,
 * Or à l'« Intermédiaire », Platine à l'« Avancé », et Platine III est acquis au niveau « Élite ».
 * Chaque tier est divisé en 3 paliers égaux.
 */
const buildThresholds = (levels: StandardLevels, scaleFactor: number): number[] => {
  const [beginner, novice, intermediate, advanced, elite] = levels.map(
    (level) => level * scaleFactor,
  )
  const anchors = [beginner * ENTRY_RATIO, novice, intermediate, advanced, elite]

  return anchors.flatMap((anchor, index) => {
    const next = anchors[index + 1]

    if (next === undefined) {
      return [anchor]
    }

    return Array.from(
      { length: STEPS_PER_TIER },
      (_unused, step) => anchor + ((next - anchor) * step) / STEPS_PER_TIER,
    )
  })
}

const computeScore = (metric: number, thresholds: number[]): number => {
  if (metric <= thresholds[0]) {
    return 0
  }

  const last = thresholds.length - 1

  if (metric >= thresholds[last]) {
    return last
  }

  const stepIndex = thresholds.findIndex(
    (threshold, index) => metric < thresholds[index + 1] && metric >= threshold,
  )

  return (
    stepIndex +
    (metric - thresholds[stepIndex]) / (thresholds[stepIndex + 1] - thresholds[stepIndex])
  )
}

const computeMetric = (
  standard: StrengthStandard,
  set: ExerciseSetPoint,
  bodyWeightKg: number,
): number => {
  if (standard.kind === 'reps') {
    return set.reps
  }

  const totalLoad = standard.bodyweightShare * bodyWeightKg + set.weight * standard.handMultiplier

  return totalLoad * (1 + set.reps / EPLEY_DIVISOR)
}

const roundToTenth = (value: number) => Math.round(value * 10) / 10

const buildNextRankTarget = (
  standard: StrengthStandard,
  bestSet: ExerciseSetPoint,
  bestMetric: number,
  targetMetric: number,
  bodyWeightKg: number,
): NextRankTarget => {
  if (standard.kind === 'reps') {
    return {
      value: Math.ceil(targetMetric),
      remaining: Math.max(1, Math.ceil(targetMetric - bestMetric)),
      unit: standard.unit,
    }
  }

  const bodyLoad = standard.bodyweightShare * bodyWeightKg

  // Sans charge ajoutée sur un exercice au poids de corps, l'objectif se lit en répétitions
  if (bodyLoad > 0 && bestSet.weight === 0) {
    const targetReps = Math.ceil(EPLEY_DIVISOR * (targetMetric / bodyLoad - 1))

    return { value: targetReps, remaining: Math.max(1, targetReps - bestSet.reps), unit: 'reps' }
  }

  return {
    value: roundToTenth(targetMetric),
    remaining: roundToTenth(Math.max(0, targetMetric - bestMetric)),
    unit: 'kg',
    perHand: standard.handMultiplier === 2 ? roundToTenth(targetMetric / 2) : undefined,
    includesBodyweight: bodyLoad > 0,
  }
}

/**
 * Rang d'un exercice selon des standards de force absolus (poids total soulevé, mis à
 * l'échelle du poids de corps), et non selon la première performance de l'utilisateur.
 * Renvoie null si l'exercice n'a pas de standard.
 */
export const computeExerciseRank = (
  exerciseId: string,
  sets: ExerciseSetPoint[],
  bodyWeightKg: number,
): ExerciseRank | null => {
  const standard = STRENGTH_STANDARDS[exerciseId]
  const validSets = sets.filter((set) => set.reps > 0)

  if (!standard || validSets.length === 0) {
    return null
  }

  const scaleFactor =
    standard.kind === 'load' ? bodyWeightKg / STANDARDS_REFERENCE_BODY_WEIGHT_KG : 1
  const thresholds = buildThresholds(standard.levels, scaleFactor)

  const scored = validSets.map((set) => ({
    set,
    metric: computeMetric(standard, set, bodyWeightKg),
  }))
  const best = scored.reduce((currentBest, candidate) =>
    candidate.metric > currentBest.metric ? candidate : currentBest,
  )

  const score = computeScore(best.metric, thresholds)
  const isMaxed = score >= TOTAL_STEPS
  const nextRankTarget = isMaxed
    ? null
    : buildNextRankTarget(
        standard,
        best.set,
        best.metric,
        thresholds[Math.floor(score) + 1],
        bodyWeightKg,
      )

  return { ...rankFromScore(score), score, nextRankTarget }
}

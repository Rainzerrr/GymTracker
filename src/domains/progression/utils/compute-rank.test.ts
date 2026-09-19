import { describe, expect, it } from 'vitest'
import { computeExerciseRank, rankFromScore } from './compute-rank'

// Squat barre libre : seuils 1RM [75, 101, 132, 168, 206] kg pour un pratiquant de 80 kg.
const SQUAT = 'squat-barre-libre'

describe('rankFromScore', () => {
  it('démarre à Bronze I à 0', () => {
    expect(rankFromScore(0)).toEqual({ tier: 'bronze', subLevel: 1, progressPercent: 0 })
  })

  it('passe au tier suivant tous les 3 paliers', () => {
    expect(rankFromScore(3)).toMatchObject({ tier: 'argent', subLevel: 1 })
    expect(rankFromScore(8.5)).toMatchObject({ tier: 'or', subLevel: 3 })
  })

  it('plafonne à Platine III', () => {
    expect(rankFromScore(12)).toMatchObject({ tier: 'platine', subLevel: 3, progressPercent: 100 })
    expect(rankFromScore(99)).toMatchObject({ tier: 'platine', subLevel: 3 })
  })

  it('ne descend pas sous Bronze I', () => {
    expect(rankFromScore(-4)).toMatchObject({ tier: 'bronze', subLevel: 1 })
  })
})

describe('computeExerciseRank', () => {
  it('renvoie null pour un exercice sans standard', () => {
    expect(computeExerciseRank('exercice-inconnu', [{ weight: 100, reps: 5 }], 80)).toBeNull()
  })

  it('renvoie null sans série valide', () => {
    expect(computeExerciseRank(SQUAT, [], 80)).toBeNull()
    expect(computeExerciseRank(SQUAT, [{ weight: 100, reps: 0 }], 80)).toBeNull()
  })

  it('reste en Bronze I avec une charge très légère', () => {
    expect(computeExerciseRank(SQUAT, [{ weight: 10, reps: 1 }], 80)).toMatchObject({
      tier: 'bronze',
      subLevel: 1,
      score: 0,
    })
  })

  it('classe selon le standard absolu et non selon la première performance', () => {
    expect(computeExerciseRank(SQUAT, [{ weight: 100, reps: 1 }], 80)).toMatchObject({
      tier: 'argent',
      subLevel: 1,
    })
  })

  it('retient la meilleure série estimée', () => {
    const rank = computeExerciseRank(
      SQUAT,
      [
        { weight: 50, reps: 10 },
        { weight: 100, reps: 1 },
      ],
      80,
    )

    expect(rank).toMatchObject({ tier: 'argent', subLevel: 1 })
  })

  it('exige plus de charge quand le poids de corps augmente', () => {
    expect(computeExerciseRank(SQUAT, [{ weight: 100, reps: 1 }], 100)).toMatchObject({
      tier: 'bronze',
    })
  })

  it('annonce l’objectif du palier suivant', () => {
    const rank = computeExerciseRank(SQUAT, [{ weight: 100, reps: 1 }], 80)

    expect(rank?.nextRankTarget).toMatchObject({ unit: 'kg', value: 111.3, remaining: 8 })
  })

  it('n’a plus d’objectif une fois Platine III atteint', () => {
    const rank = computeExerciseRank(SQUAT, [{ weight: 300, reps: 5 }], 80)

    expect(rank).toMatchObject({ tier: 'platine', subLevel: 3, nextRankTarget: null })
  })
})

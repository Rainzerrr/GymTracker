import { describe, expect, it } from 'vitest'
import type { ExercisePerformance } from '@domains/progression/utils/build-exercise-performance-index'
import { DEFAULT_REPS, DEFAULT_WEIGHT, resolveSetPrefill } from './set-prefill'

const performance = (points: { weight: number; reps: number }[]): ExercisePerformance => ({
  exerciseId: 'squat-barre-libre',
  name: 'Squat',
  thumbnailUrl: '',
  muscleGroup: 'quadriceps',
  points: points.map((bestSet, index) => ({
    completedAt: `2026-09-0${index + 1}T10:00:00.000Z`,
    value: 0,
    bestSet,
  })),
})

describe('resolveSetPrefill', () => {
  it('reprend la meilleure série de la dernière séance', () => {
    const index = new Map([
      [
        'squat-barre-libre',
        performance([
          { weight: 80, reps: 5 },
          { weight: 85, reps: 5 },
        ]),
      ],
    ])

    expect(resolveSetPrefill(index, 'squat-barre-libre')).toEqual({ weight: 85, reps: 5 })
  })

  it('utilise les valeurs par défaut pour un exercice jamais fait', () => {
    expect(resolveSetPrefill(new Map(), 'inconnu')).toEqual({
      weight: DEFAULT_WEIGHT,
      reps: DEFAULT_REPS,
    })
  })
})

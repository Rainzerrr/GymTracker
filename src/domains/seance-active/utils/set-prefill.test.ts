import { describe, expect, it } from 'vitest'
import type { ExercisePerformance } from '@domains/progression/utils/build-exercise-performance-index'
import { DEFAULT_REPS, DEFAULT_WEIGHT, resolveNextTarget, resolveSetPrefill } from './set-prefill'
import type { PrefillExercise } from './set-prefill'

type Session = { weight: number; reps: number }[]

const performance = (sessions: Session[]): ExercisePerformance => ({
  exerciseId: 'squat-barre-libre',
  name: 'Squat',
  thumbnailUrl: '',
  muscleGroup: 'quadriceps',
  points: sessions.map((sets, index) => ({
    completedAt: `2026-09-0${index + 1}T10:00:00.000Z`,
    value: 0,
    bestSet: sets[0],
    sets: sets.map((set) => ({ ...set, rir: '1' as const })),
  })),
})

const squat: PrefillExercise = {
  libraryExerciseId: 'squat-barre-libre',
  repRange: { min: 6, max: 10 },
  weightIncrement: 5,
  isBodyweight: false,
}

describe('resolveSetPrefill', () => {
  it("part de la dernière séance : une rep de plus tant que la fourchette n'est pas atteinte", () => {
    const index = new Map([
      [
        'squat-barre-libre',
        performance([
          [{ weight: 80, reps: 5 }],
          [
            { weight: 85, reps: 8 },
            { weight: 85, reps: 7 },
          ],
        ]),
      ],
    ])

    expect(resolveSetPrefill(index, squat)).toEqual({ weight: 85, reps: 8 })
  })

  it('monte la charge quand le haut de fourchette est atteint partout', () => {
    const index = new Map([
      [
        'squat-barre-libre',
        performance([
          [
            { weight: 85, reps: 10 },
            { weight: 85, reps: 10 },
          ],
        ]),
      ],
    ])

    expect(resolveSetPrefill(index, squat)).toEqual({ weight: 90, reps: 6 })
    expect(resolveNextTarget(index, squat)?.reason).toBe('more-weight')
  })

  it('propose le bas de la fourchette pour un exercice jamais fait', () => {
    expect(resolveSetPrefill(new Map(), squat)).toEqual({ weight: DEFAULT_WEIGHT, reps: 6 })
  })

  it('utilise des reps génériques sans fourchette exploitable', () => {
    expect(resolveSetPrefill(new Map(), { ...squat, repRange: null })).toEqual({
      weight: DEFAULT_WEIGHT,
      reps: DEFAULT_REPS,
    })
    expect(resolveNextTarget(new Map(), squat)).toBeNull()
  })
})

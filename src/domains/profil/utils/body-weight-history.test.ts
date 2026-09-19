import { describe, expect, it } from 'vitest'
import {
  computeWeightDeltas,
  removeBodyWeightEntry,
  upsertBodyWeightEntry,
} from './body-weight-history'

const at = (day: number, hour = 8) => new Date(2026, 8, day, hour)

describe('upsertBodyWeightEntry', () => {
  it('ajoute une pesée et garde l’ordre chronologique', () => {
    const history = upsertBodyWeightEntry(upsertBodyWeightEntry([], 82, at(12)), 81, at(5))

    expect(history.map((entry) => entry.kg)).toEqual([81, 82])
  })

  it('remplace la pesée du même jour', () => {
    const first = upsertBodyWeightEntry([], 82, at(12, 8))
    const history = upsertBodyWeightEntry(first, 81.5, at(12, 20))

    expect(history).toHaveLength(1)
    expect(history[0].kg).toBe(81.5)
  })

  it('ne confond pas minuit passé avec la veille', () => {
    const history = upsertBodyWeightEntry(upsertBodyWeightEntry([], 82, at(12, 23)), 81, at(13, 0))

    expect(history).toHaveLength(2)
  })
})

describe('removeBodyWeightEntry', () => {
  it('retire la pesée demandée', () => {
    const history = upsertBodyWeightEntry(upsertBodyWeightEntry([], 82, at(5)), 81, at(6))

    expect(removeBodyWeightEntry(history, history[0].recordedAt).map((e) => e.kg)).toEqual([81])
  })
})

describe('computeWeightDeltas', () => {
  it('donne l’écart avec la pesée précédente', () => {
    const history = [82, 81.4, 81.9].map((kg, index) => ({
      recordedAt: at(index + 1).toISOString(),
      kg,
    }))

    expect(computeWeightDeltas(history)).toEqual([null, -0.6, 0.5])
  })
})

import { describe, expect, it } from 'vitest'
import { computeStreakTrend } from './compute-streaks'

const at = (year: number, monthIndex: number, day: number, hour = 18) =>
  new Date(year, monthIndex, day, hour).toISOString()

describe('computeStreakTrend', () => {
  it('marque les jours entraînés sur les 7 derniers jours, aujourd’hui en dernier', () => {
    const dates = [at(2026, 8, 13), at(2026, 8, 19)]

    expect(computeStreakTrend(dates, 7, new Date(2026, 8, 19, 20))).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      true,
    ])
  })

  it('reste juste à cheval sur le changement d’heure', () => {
    const dates = [at(2026, 9, 24), at(2026, 9, 26)]

    expect(computeStreakTrend(dates, 3, new Date(2026, 9, 26, 20))).toEqual([true, false, true])
  })
})

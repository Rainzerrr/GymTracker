import { describe, expect, it } from 'vitest'
import { computeStreakTrend, computeStreaks } from './compute-streaks'

const at = (year: number, monthIndex: number, day: number, hour = 18) =>
  new Date(year, monthIndex, day, hour).toISOString()

describe('computeStreaks', () => {
  it('renvoie 0 sans aucune séance', () => {
    expect(computeStreaks([])).toEqual({ current: 0, longest: 0 })
  })

  it('compte les jours consécutifs jusqu’à aujourd’hui', () => {
    const dates = [at(2026, 8, 17), at(2026, 8, 18), at(2026, 8, 19)]

    expect(computeStreaks(dates, new Date(2026, 8, 19, 20))).toEqual({ current: 3, longest: 3 })
  })

  it('garde la série en vie si la dernière séance date d’hier', () => {
    const dates = [at(2026, 8, 17), at(2026, 8, 18)]

    expect(computeStreaks(dates, new Date(2026, 8, 19, 9)).current).toBe(2)
  })

  it('remet la série à 0 après un jour sans séance, en gardant le record', () => {
    const dates = [at(2026, 8, 10), at(2026, 8, 11), at(2026, 8, 12)]

    expect(computeStreaks(dates, new Date(2026, 8, 19))).toEqual({ current: 0, longest: 3 })
  })

  it('compte une seule fois plusieurs séances le même jour', () => {
    const dates = [at(2026, 8, 18, 8), at(2026, 8, 18, 19)]

    expect(computeStreaks(dates, new Date(2026, 8, 18, 21))).toEqual({ current: 1, longest: 1 })
  })

  it('ne casse pas la série au passage à l’heure d’hiver (jour de 25 h)', () => {
    const dates = [at(2026, 9, 23), at(2026, 9, 24), at(2026, 9, 25), at(2026, 9, 26)]

    expect(computeStreaks(dates, new Date(2026, 9, 26, 20))).toEqual({ current: 4, longest: 4 })
  })

  it('ne casse pas la série au passage à l’heure d’été (jour de 23 h)', () => {
    const dates = [at(2026, 2, 27), at(2026, 2, 28), at(2026, 2, 29), at(2026, 2, 30)]

    expect(computeStreaks(dates, new Date(2026, 2, 30, 20))).toEqual({ current: 4, longest: 4 })
  })
})

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

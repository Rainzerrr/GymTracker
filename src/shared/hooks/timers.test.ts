import { describe, expect, it } from 'vitest'
import { computeRemainingSeconds } from './use-countdown'
import { computeElapsedSeconds } from './use-stopwatch'

describe('computeElapsedSeconds', () => {
  it('compte le temps réel écoulé, même si aucun tick n’a eu lieu entre-temps', () => {
    const startedAt = 1_000_000

    expect(computeElapsedSeconds(startedAt, startedAt + 95_400)).toBe(95)
  })

  it('ne devient jamais négatif', () => {
    expect(computeElapsedSeconds(5_000, 4_000)).toBe(0)
  })
})

describe('computeRemainingSeconds', () => {
  it('arrondit à la seconde supérieure', () => {
    expect(computeRemainingSeconds(10_000, 8_200, 90)).toBe(2)
  })

  it('tombe à 0 une fois l’échéance passée, même après un long écran verrouillé', () => {
    expect(computeRemainingSeconds(10_000, 500_000, 90)).toBe(0)
  })

  it('ne dépasse pas la durée totale quand l’horloge est encore périmée', () => {
    expect(computeRemainingSeconds(1_000_000 + 90_000, 0, 90)).toBe(90)
  })
})

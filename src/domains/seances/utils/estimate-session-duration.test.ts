import { describe, expect, it } from 'vitest'
import { estimateSessionMinutes } from './estimate-session-duration'

describe('estimateSessionMinutes', () => {
  it('donne 0 pour une séance vide', () => {
    expect(estimateSessionMinutes([])).toBe(0)
  })

  it("compte l'effort, les repos entre séries et les changements de poste", () => {
    // 4 exercices × (3 × 45 s + 2 × 90 s) + 3 × 60 s = 1 260 + 180 = 1 440 s = 24 min → 25
    const exercises = Array.from({ length: 4 }, () => ({ setCount: 3, restSeconds: 90 }))

    expect(estimateSessionMinutes(exercises)).toBe(25)
  })

  it('reste plus long quand les repos sont plus longs', () => {
    const short = [{ setCount: 4, restSeconds: 60 }]
    const long = [{ setCount: 4, restSeconds: 180 }]

    expect(estimateSessionMinutes(long)).toBeGreaterThan(estimateSessionMinutes(short))
  })
})

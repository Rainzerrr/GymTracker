import { describe, expect, it } from 'vitest'
import { toLocalDateKey } from './to-local-date-key'

describe('toLocalDateKey', () => {
  it('formate la date locale en AAAA-MM-JJ', () => {
    expect(toLocalDateKey(new Date(2026, 8, 5, 12))).toBe('2026-09-05')
  })

  it('reste sur le jour local juste après minuit, contrairement à la date UTC', () => {
    const justAfterMidnight = new Date(2026, 8, 19, 0, 30)

    expect(justAfterMidnight.toISOString().slice(0, 10)).toBe('2026-09-18')
    expect(toLocalDateKey(justAfterMidnight)).toBe('2026-09-19')
  })
})

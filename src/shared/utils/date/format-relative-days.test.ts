import { describe, expect, it } from 'vitest'
import { formatRelativeDays } from './format-relative-days'

const now = new Date(2026, 8, 19, 18, 30)

describe('formatRelativeDays', () => {
  it("parle en jours pour les dates proches, sans tenir compte de l'heure", () => {
    expect(formatRelativeDays(new Date(2026, 8, 19, 7, 0), now)).toBe('aujourd’hui')
    expect(formatRelativeDays(new Date(2026, 8, 18, 23, 59), now)).toBe('hier')
    expect(formatRelativeDays(new Date(2026, 8, 16, 10, 0), now)).toBe('il y a 3 jours')
  })

  it('passe aux semaines puis aux mois', () => {
    expect(formatRelativeDays(new Date(2026, 8, 5), now)).toBe('il y a 2 semaines')
    expect(formatRelativeDays(new Date(2026, 5, 19), now)).toBe('il y a 3 mois')
  })

  it("tient le compte à travers le changement d'heure", () => {
    // Passage à l'heure d'hiver le 25 octobre 2026 (Europe/Paris).
    expect(formatRelativeDays(new Date(2026, 9, 24, 12), new Date(2026, 9, 26, 12))).toBe(
      'avant-hier',
    )
  })
})

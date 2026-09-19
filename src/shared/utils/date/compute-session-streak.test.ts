import { describe, expect, it } from 'vitest'
import { computeSessionStreak } from './compute-session-streak'
import type { DayKind } from './compute-session-streak'

// Septembre 2026 : le 14 est un lundi, le 19 un samedi.
const at = (day: number) => new Date(2026, 8, day, 18).toISOString()
const today = (day: number) => new Date(2026, 8, day, 20)

// Planning : séances lundi, mercredi, vendredi ; repos les autres jours.
const monWedFri = (date: Date): DayKind => ([1, 3, 5].includes(date.getDay()) ? 'training' : 'rest')
const allFree = (): DayKind => 'free'

describe('computeSessionStreak', () => {
  it('vaut 0 sans aucune séance', () => {
    expect(
      computeSessionStreak({
        completedAtDates: [],
        getDayKind: monWedFri,
        programStartKey: null,
        today: today(19),
      }),
    ).toBe(0)
  })

  it("compte les séances d'affilée sans que les jours de repos cassent la série", () => {
    expect(
      computeSessionStreak({
        completedAtDates: [at(14), at(16), at(18)],
        getDayKind: monWedFri,
        programStartKey: null,
        today: today(19),
      }),
    ).toBe(3)
  })

  it('est cassée par une séance prévue et manquée', () => {
    expect(
      computeSessionStreak({
        completedAtDates: [at(14), at(18)],
        getDayKind: monWedFri,
        programStartKey: null,
        today: today(19),
      }),
    ).toBe(1)
  })

  it("ne pénalise pas la séance du jour tant qu'elle n'est pas faite", () => {
    // Lundi 21 : séance prévue mais pas encore faite, la série des jours précédents reste intacte.
    expect(
      computeSessionStreak({
        completedAtDates: [at(14), at(16), at(18)],
        getDayKind: monWedFri,
        programStartKey: null,
        today: today(21),
      }),
    ).toBe(3)
  })

  it("ne compte pas comme manquées les séances d'avant le début du programme", () => {
    // Programme lancé le samedi 19 : lundi, mercredi et vendredi précédents ne comptent pas.
    expect(
      computeSessionStreak({
        completedAtDates: [at(19)],
        getDayKind: monWedFri,
        programStartKey: '2026-09-19',
        today: today(19),
      }),
    ).toBe(1)
  })

  it('compte comme manquée une séance prévue après le début du programme', () => {
    expect(
      computeSessionStreak({
        completedAtDates: [at(14)],
        getDayKind: monWedFri,
        programStartKey: '2026-09-14',
        today: today(19),
      }),
    ).toBe(0)
  })

  it('compte une seule fois plusieurs séances le même jour', () => {
    expect(
      computeSessionStreak({
        completedAtDates: [at(18), new Date(2026, 8, 18, 8).toISOString()],
        getDayKind: allFree,
        programStartKey: null,
        today: today(18),
      }),
    ).toBe(1)
  })

  it("ne casse pas la série au changement d'heure (jour de 25 h)", () => {
    // Passage à l'heure d'hiver le 25 octobre 2026, jours libres.
    const dates = [24, 25, 26].map((day) => new Date(2026, 9, day, 18).toISOString())

    expect(
      computeSessionStreak({
        completedAtDates: dates,
        getDayKind: allFree,
        programStartKey: null,
        today: new Date(2026, 9, 26, 20),
      }),
    ).toBe(3)
  })

  describe('sans planning (jours libres)', () => {
    it("tolère jusqu'à 3 jours sans séance", () => {
      expect(
        computeSessionStreak({
          completedAtDates: [at(15), at(18)],
          getDayKind: allFree,
          programStartKey: null,
          today: today(19),
        }),
      ).toBe(2)
    })

    it('est rompue après plus de 3 jours sans séance', () => {
      expect(
        computeSessionStreak({
          completedAtDates: [at(10), at(11)],
          getDayKind: allFree,
          programStartKey: null,
          today: today(19),
        }),
      ).toBe(0)
    })
  })
})

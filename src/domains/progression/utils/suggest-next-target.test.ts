import { describe, expect, it } from 'vitest'
import { suggestNextTarget } from './suggest-next-target'
import type { TargetSet } from './suggest-next-target'

const range = { min: 8, max: 12 }
const base = { repRange: range, weightIncrement: 2.5, isBodyweight: false }
const sets = (weight: number, reps: number[], rir: TargetSet['rir'] = '1'): TargetSet[] =>
  reps.map((value) => ({ weight, reps: value, rir }))

describe('suggestNextTarget', () => {
  it('ne propose rien sans série valide', () => {
    expect(suggestNextTarget({ ...base, lastSets: [] })).toBeNull()
    expect(suggestNextTarget({ ...base, lastSets: sets(60, [0, 0]) })).toBeNull()
  })

  it("vise une rep de plus au poids habituel quand le haut de fourchette n'est pas atteint", () => {
    expect(suggestNextTarget({ ...base, lastSets: sets(60, [10, 9, 8]) })).toEqual({
      weight: 60,
      reps: 9,
      reason: 'more-reps',
    })
  })

  it('monte la charge et repart du bas de la fourchette au haut de fourchette partout', () => {
    expect(suggestNextTarget({ ...base, lastSets: sets(60, [12, 12, 12]) })).toEqual({
      weight: 62.5,
      reps: 8,
      reason: 'more-weight',
    })
  })

  it('double le saut quand tout était facile (RIR 3)', () => {
    expect(suggestNextTarget({ ...base, lastSets: sets(60, [12, 12, 12], '3') })).toEqual({
      weight: 65,
      reps: 8,
      reason: 'more-weight',
    })
  })

  it("ne double pas le saut si le RIR n'a pas été renseigné", () => {
    expect(suggestNextTarget({ ...base, lastSets: sets(60, [12, 12], null) })?.weight).toBe(62.5)
  })

  it('consolide après un échec au haut de fourchette', () => {
    const lastSets = [...sets(60, [12, 12]), { weight: 60, reps: 12, rir: 'echec' as const }]

    expect(suggestNextTarget({ ...base, lastSets })).toEqual({
      weight: 60,
      reps: 12,
      reason: 'consolidate',
    })
  })

  it('reste au bas de la fourchette si on est passé dessous', () => {
    expect(suggestNextTarget({ ...base, lastSets: sets(60, [7, 6, 6]) })).toEqual({
      weight: 60,
      reps: 8,
      reason: 'repeat',
    })
  })

  it('ne juge que les séries à la charge la plus haute (back-off ignoré)', () => {
    const lastSets = [...sets(60, [12, 12]), { weight: 50, reps: 8, rir: '1' as const }]

    expect(suggestNextTarget({ ...base, lastSets })?.reason).toBe('more-weight')
  })

  it('rejoue la meilleure série sans fourchette exploitable', () => {
    expect(suggestNextTarget({ ...base, repRange: null, lastSets: sets(40, [10, 8, 7]) })).toEqual({
      weight: 40,
      reps: 10,
      reason: 'repeat',
    })
  })

  it('progresse en reps seulement au poids du corps', () => {
    expect(
      suggestNextTarget({
        ...base,
        isBodyweight: true,
        lastSets: sets(0, [12, 12, 12]),
      }),
    ).toEqual({ weight: 0, reps: 13, reason: 'more-reps' })
  })

  it('arrondit au demi-kilo', () => {
    expect(
      suggestNextTarget({ ...base, weightIncrement: 2, lastSets: sets(21.5, [12, 12]) })?.weight,
    ).toBe(23.5)
  })
})

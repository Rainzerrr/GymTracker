import { describe, expect, it } from 'vitest'
import type { TFunction } from 'i18next'
import { formatLastSets, formatNextTarget } from './build-history-labels'

// Traduction factice : renvoie la clé et les valeurs, pour vérifier ce que le composant reçoit.
const t = ((key: string, values?: Record<string, unknown>) =>
  `${key} ${JSON.stringify(values)}`) as unknown as TFunction<'seanceActive'>

const set = (weight: number, reps: number) => ({ weight, reps, rir: null })

describe('formatLastSets', () => {
  it('regroupe les séries consécutives à la même charge', () => {
    expect(formatLastSets(t, [set(80, 8), set(80, 8), set(80, 7), set(85, 6)])).toBe(
      'lastSets {"sets":"80 kg × 8, 8, 7 · 85 kg × 6"}',
    )
  })

  it('formate les charges décimales à la française', () => {
    expect(formatLastSets(t, [set(82.5, 8)])).toBe('lastSets {"sets":"82,5 kg × 8"}')
  })

  it("n'affiche que les reps sans charge", () => {
    expect(formatLastSets(t, [set(0, 12), set(0, 10)])).toBe('lastSetsReps {"reps":"12, 10"}')
  })
})

describe('formatNextTarget', () => {
  it('choisit le libellé selon la raison', () => {
    const target = { weight: 62.5, reps: 8, reason: 'more-weight' as const }

    expect(formatNextTarget(t, target, false)).toBe('target.moreWeight {"weight":"62,5","reps":8}')
  })

  it("n'affiche que les reps au poids du corps", () => {
    const target = { weight: 0, reps: 13, reason: 'more-reps' as const }

    expect(formatNextTarget(t, target, true)).toBe('targetReps.moreReps {"weight":"0","reps":13}')
  })
})

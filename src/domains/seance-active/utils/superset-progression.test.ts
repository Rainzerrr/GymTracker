import { describe, expect, it } from 'vitest'
import { buildGroups, resolveNextStep } from './superset-progression'

describe('buildGroups', () => {
  it('regroupe les exercices enchaînés en superset', () => {
    expect(buildGroups([true, false, false])).toEqual([[0, 1], [2]])
  })

  it('garde chaque exercice seul sans superset', () => {
    expect(buildGroups([false, false, false])).toEqual([[0], [1], [2]])
  })

  it('gère une chaîne de trois exercices', () => {
    expect(buildGroups([true, true, false])).toEqual([[0, 1, 2]])
  })
})

describe('resolveNextStep', () => {
  it('alterne entre les exercices d’un superset', () => {
    expect(resolveNextStep([0, 1], 0, [1, 0, 0], [3, 3, 3])).toBe(1)
    expect(resolveNextStep([0, 1], 1, [1, 1, 0], [3, 3, 3])).toBe(0)
  })

  it('reste sur le même exercice quand il est seul dans son groupe', () => {
    expect(resolveNextStep([0], 0, [1, 0], [3, 3])).toBe(0)
  })

  it('finit le superset avant de passer au groupe suivant', () => {
    expect(resolveNextStep([0, 1], 0, [3, 2, 0], [3, 3, 3])).toBe(1)
    expect(resolveNextStep([0, 1], 1, [3, 3, 0], [3, 3, 3])).toBe(2)
  })

  it('renvoie -1 quand toutes les séries sont faites', () => {
    expect(resolveNextStep([1], 1, [3, 3], [3, 3])).toBe(-1)
  })
})

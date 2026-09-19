import { describe, expect, it } from 'vitest'
import { moveToStep } from './move-to-step'

const start = { index: 2, direction: 'forward' as const }

describe('moveToStep', () => {
  it('avance et recule avec le bon sens', () => {
    expect(moveToStep(start, 3, 7)).toEqual({ index: 3, direction: 'forward' })
    expect(moveToStep(start, 0, 7)).toEqual({ index: 0, direction: 'backward' })
  })

  it('reste dans les bornes', () => {
    expect(moveToStep({ index: 6, direction: 'forward' }, 7, 7)).toEqual({
      index: 6,
      direction: 'forward',
    })
    expect(moveToStep({ index: 0, direction: 'backward' }, -1, 7).index).toBe(0)
  })

  it('renvoie la même position (même référence) sans changement', () => {
    expect(moveToStep(start, 2, 7)).toBe(start)
  })
})

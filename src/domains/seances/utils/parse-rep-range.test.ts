import { describe, expect, it } from 'vitest'
import { parseRepRange } from './parse-rep-range'

describe('parseRepRange', () => {
  it('lit une fourchette', () => {
    expect(parseRepRange('3 × 8-12')).toEqual({ min: 8, max: 12 })
    expect(parseRepRange('4 × 6 - 10')).toEqual({ min: 6, max: 10 })
  })

  it('accepte un x ascii et une fourchette inversée', () => {
    expect(parseRepRange('3 x 12-8')).toEqual({ min: 8, max: 12 })
  })

  it('traite un nombre seul comme une fourchette réduite', () => {
    expect(parseRepRange('5 × 5')).toEqual({ min: 5, max: 5 })
  })

  it('ne devine rien sans nombre de reps ou sans séparateur', () => {
    expect(parseRepRange('3 × Max')).toBeNull()
    expect(parseRepRange('3 séries')).toBeNull()
    expect(parseRepRange('')).toBeNull()
  })
})

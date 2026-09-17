import type { TierSubLevel } from '../types/tier'

const ROMAN_NUMERALS: Record<TierSubLevel, string> = { 1: 'I', 2: 'II', 3: 'III' }

export const getSubLevelRoman = (subLevel: TierSubLevel): string => ROMAN_NUMERALS[subLevel]

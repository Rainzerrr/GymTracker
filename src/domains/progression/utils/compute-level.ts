const LEVEL_TITLES = [
  'Débutant',
  'Assidu',
  'Motivé',
  'Discipliné',
  'Rigoureux',
  'Déterminé',
  'Vétéran',
  'Expert',
  'Élite',
  'Légende',
]

const xpRequiredForLevel = (level: number): number => 300 + (level - 1) * 150

export type LevelResult = {
  level: number
  levelTitle: string
  currentXp: number
  xpToNextLevel: number
}

export const computeLevel = (totalXp: number): LevelResult => {
  let level = 1
  let remaining = totalXp

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level)
    level += 1
  }

  return {
    level,
    levelTitle: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1],
    currentXp: remaining,
    xpToNextLevel: xpRequiredForLevel(level),
  }
}

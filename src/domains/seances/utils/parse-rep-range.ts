export type RepRange = { min: number; max: number }

const SETS_SEPARATOR = /[×x]/i
const RANGE_PATTERN = /(\d+)\s*[-–]\s*(\d+)/
const SINGLE_PATTERN = /(\d+)/

/**
 * Fourchette de reps d'un objectif « 3 × 8-12 » (ou « 3 × 10 » : min = max). `null` pour un
 * objectif sans nombre (« 3 × Max ») ou un texte libre sans le séparateur « × ».
 */
export const parseRepRange = (targetLabel: string): RepRange | null => {
  const [, repsPart] = targetLabel.split(SETS_SEPARATOR, 2)

  if (repsPart === undefined) {
    return null
  }

  const rangeMatch = repsPart.match(RANGE_PATTERN)

  if (rangeMatch) {
    const first = Number(rangeMatch[1])
    const second = Number(rangeMatch[2])

    return { min: Math.min(first, second), max: Math.max(first, second) }
  }

  const singleMatch = repsPart.match(SINGLE_PATTERN)

  return singleMatch ? { min: Number(singleMatch[1]), max: Number(singleMatch[1]) } : null
}

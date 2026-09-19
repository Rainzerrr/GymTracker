const DAY_MS = 24 * 60 * 60 * 1000

export type StreakResult = {
  current: number
  longest: number
}

// Numéro de jour calendaire local : deux jours consécutifs diffèrent toujours de 1, même quand le
// jour dure 23 h ou 25 h (changement d'heure), ce que ne garantit pas une différence en millisecondes.
const toDayNumber = (date: Date): number =>
  Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS)

const isoToDayNumber = (iso: string): number => toDayNumber(new Date(iso))

export const computeStreaks = (
  completedAtDates: string[],
  referenceDate: Date = new Date(),
): StreakResult => {
  if (completedAtDates.length === 0) {
    return { current: 0, longest: 0 }
  }

  const dayNumbers = Array.from(new Set(completedAtDates.map(isoToDayNumber))).sort((a, b) => b - a)

  let longest = 1
  let run = 1
  for (let i = 1; i < dayNumbers.length; i += 1) {
    run = dayNumbers[i - 1] - dayNumbers[i] === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
  }

  const today = toDayNumber(referenceDate)
  const isStreakAlive = dayNumbers[0] === today || dayNumbers[0] === today - 1

  let current = 0
  if (isStreakAlive) {
    current = 1
    for (let i = 1; i < dayNumbers.length; i += 1) {
      if (dayNumbers[i - 1] - dayNumbers[i] === 1) {
        current += 1
      } else {
        break
      }
    }
  }

  return { current, longest }
}

export const computeStreakTrend = (
  completedAtDates: string[],
  days = 7,
  referenceDate: Date = new Date(),
): boolean[] => {
  const trainedDayNumbers = new Set(completedAtDates.map(isoToDayNumber))
  const today = toDayNumber(referenceDate)

  return Array.from({ length: days }, (_unused, index) =>
    trainedDayNumbers.has(today - (days - 1 - index)),
  )
}

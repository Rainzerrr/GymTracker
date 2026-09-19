const DAY_MS = 24 * 60 * 60 * 1000

// Numéro de jour calendaire local : deux jours consécutifs diffèrent toujours de 1, même quand le
// jour dure 23 h ou 25 h (changement d'heure), ce que ne garantit pas une différence en millisecondes.
const toDayNumber = (date: Date): number =>
  Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS)

const isoToDayNumber = (iso: string): number => toDayNumber(new Date(iso))

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

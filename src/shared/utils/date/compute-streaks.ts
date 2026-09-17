const DAY_MS = 24 * 60 * 60 * 1000

export type StreakResult = {
  current: number
  longest: number
}

const toDayKey = (iso: string): number => {
  const date = new Date(iso)
  date.setHours(0, 0, 0, 0)

  return date.getTime()
}

export const computeStreaks = (
  completedAtDates: string[],
  referenceDate: Date = new Date(),
): StreakResult => {
  if (completedAtDates.length === 0) {
    return { current: 0, longest: 0 }
  }

  const dayKeys = Array.from(new Set(completedAtDates.map(toDayKey))).sort((a, b) => b - a)

  let longest = 1
  let run = 1
  for (let i = 1; i < dayKeys.length; i += 1) {
    run = dayKeys[i - 1] - dayKeys[i] === DAY_MS ? run + 1 : 1
    longest = Math.max(longest, run)
  }

  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  const isStreakAlive = dayKeys[0] === today.getTime() || dayKeys[0] === today.getTime() - DAY_MS

  let current = 0
  if (isStreakAlive) {
    current = 1
    for (let i = 1; i < dayKeys.length; i += 1) {
      if (dayKeys[i - 1] - dayKeys[i] === DAY_MS) {
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
  const trainedDayKeys = new Set(completedAtDates.map(toDayKey))
  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: days }, (_unused, index) => {
    const dayKey = today.getTime() - (days - 1 - index) * DAY_MS

    return trainedDayKeys.has(dayKey)
  })
}

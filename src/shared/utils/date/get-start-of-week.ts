export const getStartOfWeek = (referenceDate: Date = new Date()): Date => {
  const startOfWeek = new Date(referenceDate)
  const currentDay = startOfWeek.getDay()
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
  startOfWeek.setDate(startOfWeek.getDate() + mondayOffset)
  startOfWeek.setHours(0, 0, 0, 0)

  return startOfWeek
}

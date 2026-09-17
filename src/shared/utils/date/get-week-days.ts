export type WeekDay = {
  index: number
  date: Date
  initial: string
  isToday: boolean
}

export const getWeekDays = (referenceDate: Date = new Date(), locale = 'fr-FR'): WeekDay[] => {
  const startOfWeek = new Date(referenceDate)
  const currentDay = startOfWeek.getDay()
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
  startOfWeek.setDate(startOfWeek.getDate() + mondayOffset)

  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })

  return Array.from({ length: 7 }, (_unused, index) => {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + index)

    return {
      index,
      date,
      initial: formatter.format(date).toUpperCase(),
      isToday: date.toDateString() === referenceDate.toDateString(),
    }
  })
}

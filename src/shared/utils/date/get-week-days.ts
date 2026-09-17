import { getStartOfWeek } from './get-start-of-week'

export type WeekDay = {
  index: number
  date: Date
  initial: string
  isToday: boolean
}

export const getWeekDays = (referenceDate: Date = new Date(), locale = 'fr-FR'): WeekDay[] => {
  const startOfWeek = getStartOfWeek(referenceDate)
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

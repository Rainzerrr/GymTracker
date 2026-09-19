const MS_PER_DAY = 86_400_000
const DAYS_PER_WEEK = 7
const DAYS_PER_MONTH = 30
const WEEKS_FROM_DAYS = 14
const MONTHS_FROM_DAYS = 60

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

// « aujourd'hui », « hier », « il y a 3 jours », « il y a 2 semaines », « il y a 3 mois ».
export const formatRelativeDays = (date: Date, now: Date = new Date()): string => {
  const formatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
  // Arrondi : un changement d'heure donne des journées de 23 h ou 25 h.
  const days = Math.round((startOfDay(date) - startOfDay(now)) / MS_PER_DAY)
  const absoluteDays = Math.abs(days)

  if (absoluteDays >= MONTHS_FROM_DAYS) {
    return formatter.format(Math.round(days / DAYS_PER_MONTH), 'month')
  }

  if (absoluteDays >= WEEKS_FROM_DAYS) {
    return formatter.format(Math.round(days / DAYS_PER_WEEK), 'week')
  }

  return formatter.format(days, 'day')
}

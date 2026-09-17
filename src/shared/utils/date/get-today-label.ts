export const getTodayLabel = (referenceDate: Date = new Date(), locale = 'fr-FR'): string => {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const label = formatter.format(referenceDate)

  return label.charAt(0).toUpperCase() + label.slice(1)
}

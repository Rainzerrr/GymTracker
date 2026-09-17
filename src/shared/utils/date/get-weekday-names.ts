export const getWeekdayNames = (locale = 'fr-FR'): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })
  const monday = new Date(2024, 0, 1)

  return Array.from({ length: 7 }, (_unused, index) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + index)
    const label = formatter.format(date)

    return label.charAt(0).toUpperCase() + label.slice(1)
  })
}

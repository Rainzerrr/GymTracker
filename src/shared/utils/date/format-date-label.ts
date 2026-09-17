export const formatDateLabel = (iso: string, locale = 'fr-FR'): string => {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return formatter.format(new Date(iso))
}

export const formatShortDateLabel = (iso: string, locale = 'fr-FR'): string => {
  const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })

  return formatter.format(new Date(iso))
}

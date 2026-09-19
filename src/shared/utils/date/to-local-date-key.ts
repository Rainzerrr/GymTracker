const pad = (value: number) => String(value).padStart(2, '0')

// Date calendaire locale (AAAA-MM-JJ). `toISOString()` donnerait la date UTC, en retard d'un jour
// entre minuit et 1 h/2 h du matin en France.
export const toLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

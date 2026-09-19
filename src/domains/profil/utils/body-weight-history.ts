import { toLocalDateKey } from '@shared/utils/date/to-local-date-key'

export type BodyWeightEntry = {
  recordedAt: string
  kg: number
}

const byRecordedAt = (a: BodyWeightEntry, b: BodyWeightEntry) =>
  new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()

// Une seule pesée par jour : en enregistrer une seconde le même jour remplace la première.
export const upsertBodyWeightEntry = (
  history: BodyWeightEntry[],
  kg: number,
  now: Date,
): BodyWeightEntry[] => {
  const todayKey = toLocalDateKey(now)
  const otherDays = history.filter(
    (entry) => toLocalDateKey(new Date(entry.recordedAt)) !== todayKey,
  )

  return [...otherDays, { recordedAt: now.toISOString(), kg }].sort(byRecordedAt)
}

export const removeBodyWeightEntry = (
  history: BodyWeightEntry[],
  recordedAt: string,
): BodyWeightEntry[] => history.filter((entry) => entry.recordedAt !== recordedAt)

// Évolution entre chaque pesée et la précédente (null pour la première), au dixième près.
export const computeWeightDeltas = (history: BodyWeightEntry[]): (number | null)[] =>
  history.map((entry, index) =>
    index === 0 ? null : Math.round((entry.kg - history[index - 1].kg) * 10) / 10,
  )

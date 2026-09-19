import { toLocalDateKey } from './to-local-date-key'

// Ce que le planning prévoit ce jour-là : une séance, du repos, ou rien (jour libre).
export type DayKind = 'training' | 'rest' | 'free'

// Au-delà de 3 jours libres d'affilée sans séance, le rythme est rompu (pas de planning strict).
const FREE_GAP_LIMIT = 3
const MAX_DAYS_SCANNED = 800

type SessionStreakInput = {
  completedAtDates: string[]
  getDayKind: (date: Date) => DayKind
  // Premier jour du programme : avant, une séance prévue non faite n'est pas un manquement.
  programStartKey: string | null
  today?: Date
}

/**
 * Streak de séances : nombre de jours d'entraînement d'affilée, en respectant le planning. Les
 * jours de repos ne cassent pas la série ; une séance prévue et non faite la casse. Aujourd'hui ne
 * compte pas comme manqué tant que la journée n'est pas finie.
 */
export const computeSessionStreak = ({
  completedAtDates,
  getDayKind,
  programStartKey,
  today = new Date(),
}: SessionStreakInput): number => {
  if (completedAtDates.length === 0) {
    return 0
  }

  const doneKeys = new Set(completedAtDates.map((iso) => toLocalDateKey(new Date(iso))))
  const todayKey = toLocalDateKey(today)
  const [oldestKey] = [...doneKeys, ...(programStartKey ? [programStartKey] : [])].sort()
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  let streak = 0
  let freeGap = 0

  for (let scanned = 0; scanned < MAX_DAYS_SCANNED; scanned += 1) {
    const key = toLocalDateKey(cursor)

    if (key < oldestKey) {
      break
    }

    if (doneKeys.has(key)) {
      streak += 1
      freeGap = 0
    } else if (key !== todayKey) {
      const kind = getDayKind(cursor)
      const isMissedSession =
        kind === 'training' && (programStartKey === null || key >= programStartKey)

      if (isMissedSession) {
        break
      }

      freeGap = kind === 'rest' ? 0 : freeGap + 1

      if (freeGap > FREE_GAP_LIMIT) {
        break
      }
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

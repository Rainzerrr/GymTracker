import exerciseLibraryData from '@domains/seances/data/exercise-library.json'
import type { ExerciseLogEntry } from '@domains/seance-active/types/exercise-log-entry'
import type { RirValue } from '@domains/seance-active/types/rir-value'
import type { SessionLogEntry } from '@domains/seance-active/types/session-log-entry'
import type { LibraryExercise } from '@domains/seances/types/library-exercise'
import type { WorkoutSession } from '@domains/seances/types/workout-session'
import { PROGRAMS, PROGRESSION } from './demo-data-programs'

// Dev-only helper: open the app with `?demo` to fill it with ten-ish weeks of
// believable training, `?demo=restore` to put the previous data back.

const SESSIONS_KEY = 'seances/sessions'
const WEEK_PLAN_KEY = 'seances/week-plan'
const SESSION_LOG_KEY = 'seance-active/session-log'
const BACKUP_PREFIX = 'demo-backup/'
const BACKED_UP_KEYS = [SESSIONS_KEY, WEEK_PLAN_KEY, SESSION_LOG_KEY]

const library = exerciseLibraryData as LibraryExercise[]

const SESSION_COUNT = 16
const DAYS_BETWEEN_SESSIONS = 2
const RIR_BY_SET: (RirValue | null)[] = ['3', '2', '1', '0']

const getLibraryExercise = (id: string) => {
  const exercise = library.find((candidate) => candidate.id === id)

  if (!exercise) {
    throw new Error(`Demo data: unknown exercise "${id}"`)
  }

  return exercise
}

const roundToHalfKilo = (value: number) => Math.round(value * 2) / 2

const buildExerciseLog = (exerciseId: string, occurrence: number): ExerciseLogEntry => {
  const exercise = getLibraryExercise(exerciseId)
  const { start, gain, reps } = PROGRESSION[exerciseId]
  const isBodyweight = exercise.equipment === 'Poids du corps' || start === 0
  // Every third session is a plateau week, like in real training.
  const effectiveOccurrence = occurrence - Math.floor(occurrence / 3) * 0.6
  const weight = isBodyweight ? 0 : roundToHalfKilo(start + gain * effectiveOccurrence)
  // Bodyweight moves progress through reps instead of load.
  const baseReps = isBodyweight ? reps + Math.floor(occurrence * 0.8) : reps

  return {
    libraryExerciseId: exercise.id,
    name: exercise.name,
    thumbnailUrl: exercise.thumbnailUrl,
    muscleGroup: exercise.muscleGroup,
    sets: [0, 1, 2].map((setIndex) => ({
      weight,
      reps: Math.max(1, baseReps - setIndex),
      rir: RIR_BY_SET[Math.min(setIndex + (occurrence % 2), RIR_BY_SET.length - 1)],
    })),
  }
}

const buildSessionLog = (): SessionLogEntry[] => {
  // Progress is tracked per exercise, so lifts shared between sessions keep climbing.
  const occurrences = new Map<string, number>()

  return Array.from({ length: SESSION_COUNT }, (_unused, index) => {
    const program = PROGRAMS[index % PROGRAMS.length]
    const completedAt = new Date()
    completedAt.setDate(completedAt.getDate() - (SESSION_COUNT - index) * DAYS_BETWEEN_SESSIONS + 1)
    completedAt.setHours(18, 30, 0, 0)

    return {
      id: `demo-log-${index}`,
      sessionName: program.name,
      imageUrl: '',
      durationMinutes: 48 + ((index * 7) % 19),
      completedAt: completedAt.toISOString(),
      exercises: program.exerciseIds.map((exerciseId) => {
        const occurrence = occurrences.get(exerciseId) ?? 0
        occurrences.set(exerciseId, occurrence + 1)

        return buildExerciseLog(exerciseId, occurrence)
      }),
    }
  })
}

const buildSessions = (): WorkoutSession[] =>
  PROGRAMS.map((program) => ({
    id: program.id,
    name: program.name,
    focusLabel: program.focusLabel,
    imageUrl: '',
    exercises: program.exerciseIds.map((exerciseId) => {
      const exercise = getLibraryExercise(exerciseId)

      return {
        id: `${program.id}-${exerciseId}`,
        libraryExerciseId: exercise.id,
        name: exercise.name,
        thumbnailUrl: exercise.thumbnailUrl,
        targetLabel: `3 × ${PROGRESSION[exerciseId].reps - 1}-${PROGRESSION[exerciseId].reps + 1}`,
        restLabel: 'Repos 90s',
        linkedToNext: false,
      }
    }),
  }))

const hasStoredValue = (key: string) => {
  const raw = window.localStorage.getItem(key)

  return raw !== null && raw !== '[]' && raw !== '{}'
}

export const restoreDemoBackup = () => {
  BACKED_UP_KEYS.forEach((key) => {
    const backup = window.localStorage.getItem(BACKUP_PREFIX + key)

    if (backup === null) {
      return
    }

    if (backup === '') {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, backup)
    }

    window.localStorage.removeItem(BACKUP_PREFIX + key)
  })
}

export const seedDemoData = () => {
  BACKED_UP_KEYS.forEach((key) => {
    // Never overwrite an earlier backup: seeding twice must not lose the real data.
    if (window.localStorage.getItem(BACKUP_PREFIX + key) === null) {
      window.localStorage.setItem(BACKUP_PREFIX + key, window.localStorage.getItem(key) ?? '')
    }
  })

  window.localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(buildSessionLog()))

  if (!hasStoredValue(SESSIONS_KEY)) {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(buildSessions()))
  }

  if (!hasStoredValue(WEEK_PLAN_KEY)) {
    const plan = Object.fromEntries(PROGRAMS.map((program, index) => [index * 2, program.id]))
    window.localStorage.setItem(WEEK_PLAN_KEY, JSON.stringify(plan))
  }
}

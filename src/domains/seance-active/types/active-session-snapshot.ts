import type { RirValue } from './rir-value'
import type { SetLogEntry } from './set-log-entry'

// État complet d'une séance en cours, persisté pour survivre à une fermeture de l'app.
export type ActiveSessionSnapshot = {
  sessionId: string
  startedAt: number
  progress: number[]
  setLogsByExercise: SetLogEntry[][]
  currentExerciseIndex: number
  reps: number
  weight: number
  selectedRir: RirValue | null
}

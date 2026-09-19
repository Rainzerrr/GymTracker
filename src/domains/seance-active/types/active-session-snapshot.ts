import type { RirValue } from './rir-value'
import type { SetLogEntry } from './set-log-entry'

// Ce qui change à chaque série validée ou passée : c'est aussi ce que « annuler » restaure.
export type SessionStep = {
  progress: number[]
  setLogsByExercise: SetLogEntry[][]
  currentExerciseIndex: number
  reps: number
  weight: number
  selectedRir: RirValue | null
}

// État complet d'une séance en cours, persisté pour survivre à une fermeture de l'app.
export type ActiveSessionSnapshot = SessionStep & {
  sessionId: string
  startedAt: number
  notesByExercise: string[]
  // État juste avant la dernière action, pour pouvoir l'annuler.
  previous: SessionStep | null
}

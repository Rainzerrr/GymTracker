import { DEFAULT_STARTER_REST_LABEL } from '../data/starter-programs'
import type { StarterProgram } from '../data/starter-programs'
import type { LibraryExercise } from '../types/library-exercise'
import type { SessionDraft } from '../types/workout-session'

const createExerciseId = (sessionIndex: number, exerciseIndex: number) =>
  `exercise-${Date.now()}-${sessionIndex}-${exerciseIndex}`

// Transforme le programme de départ en brouillons de séances prêts à être créés. Un exercice
// absent de la bibliothèque est ignoré plutôt que de casser tout le programme.
export const buildStarterDrafts = (
  program: StarterProgram,
  getLibraryExercise: (id: string) => LibraryExercise | undefined,
): SessionDraft[] =>
  program.sessions.map((session, sessionIndex) => ({
    name: session.name,
    focusLabel: session.focusLabel,
    imageUrl: '',
    exercises: session.exercises.flatMap((starterExercise, exerciseIndex) => {
      const libraryExercise = getLibraryExercise(starterExercise.libraryExerciseId)

      return libraryExercise
        ? [
            {
              id: createExerciseId(sessionIndex, exerciseIndex),
              libraryExerciseId: libraryExercise.id,
              name: libraryExercise.name,
              thumbnailUrl: libraryExercise.thumbnailUrl,
              targetLabel: starterExercise.targetLabel,
              restLabel: DEFAULT_STARTER_REST_LABEL,
              linkedToNext: false,
            },
          ]
        : []
    }),
  }))

// Programme proposé au premier lancement : trois séances par semaine (lundi, mercredi, vendredi),
// composé d'exercices de la bibliothèque.
export type StarterExercise = {
  libraryExerciseId: string
  targetLabel: string
}

export type StarterSession = {
  name: string
  focusLabel: string
  exercises: StarterExercise[]
}

export type StarterProgram = {
  sessions: StarterSession[]
  // Séance de chaque jour de la semaine (0 = lundi), null pour un jour de repos
  weekLayout: (number | null)[]
}

export const DEFAULT_STARTER_REST_LABEL = 'repos 90s'

export const STARTER_PROGRAM: StarterProgram = {
  sessions: [
    {
      name: 'Push',
      focusLabel: 'Push',
      exercises: [
        { libraryExerciseId: 'developpe-couche-barre', targetLabel: '3 × 6-10' },
        { libraryExerciseId: 'developpe-militaire-halteres', targetLabel: '3 × 8-12' },
        { libraryExerciseId: 'elevations-laterales', targetLabel: '3 × 12-15' },
        { libraryExerciseId: 'extension-triceps-poulie', targetLabel: '3 × 10-12' },
      ],
    },
    {
      name: 'Pull',
      focusLabel: 'Pull',
      exercises: [
        { libraryExerciseId: 'tirage-vertical-poulie', targetLabel: '3 × 8-12' },
        { libraryExerciseId: 'rowing-barre', targetLabel: '3 × 8-10' },
        { libraryExerciseId: 'tractions-supination', targetLabel: '3 × 5-8' },
        { libraryExerciseId: 'curl-barre', targetLabel: '3 × 10-12' },
      ],
    },
    {
      name: 'Jambes',
      focusLabel: 'Lower',
      exercises: [
        { libraryExerciseId: 'squat-barre-libre', targetLabel: '3 × 6-10' },
        { libraryExerciseId: 'presse-a-cuisses', targetLabel: '3 × 10-12' },
        { libraryExerciseId: 'leg-curl-allonge', targetLabel: '3 × 10-12' },
        { libraryExerciseId: 'mollets-debout', targetLabel: '3 × 12-15' },
      ],
    },
  ],
  weekLayout: [0, null, 1, null, 2, null, null],
}

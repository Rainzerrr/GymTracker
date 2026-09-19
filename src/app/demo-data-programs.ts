// Sample training programs used by the dev-only demo data.

export type Program = {
  id: string
  name: string
  focusLabel: string
  exerciseIds: string[]
}

export const PROGRAMS: Program[] = [
  {
    id: 'demo-push',
    name: 'Push A',
    focusLabel: 'Push',
    exerciseIds: [
      'developpe-couche-barre',
      'developpe-militaire-halteres',
      'elevations-laterales',
      'extension-triceps-poulie',
    ],
  },
  {
    id: 'demo-pull',
    name: 'Pull A',
    focusLabel: 'Pull',
    exerciseIds: ['tractions-supination', 'rowing-barre', 'tirage-vertical-poulie', 'curl-barre'],
  },
  {
    id: 'demo-lower',
    name: 'Lower A',
    focusLabel: 'Lower',
    exerciseIds: ['squat-barre-libre', 'presse-a-cuisses', 'leg-curl-allonge', 'mollets-debout'],
  },
  {
    id: 'demo-full',
    name: 'Full Body A',
    focusLabel: 'Full Body',
    exerciseIds: ['squat-barre-libre', 'developpe-couche-barre', 'rowing-barre', 'tractions-supination'],
  },
]

// Starting load (kg, or reps for bodyweight moves) and gain per session.
export const PROGRESSION: Record<string, { start: number; gain: number; reps: number }> = {
  'developpe-couche-barre': { start: 50, gain: 1.4, reps: 8 },
  'developpe-militaire-halteres': { start: 18, gain: 0.5, reps: 10 },
  'elevations-laterales': { start: 8, gain: 0.25, reps: 12 },
  'extension-triceps-poulie': { start: 20, gain: 0.8, reps: 12 },
  'tractions-supination': { start: 0, gain: 0, reps: 6 },
  'rowing-barre': { start: 50, gain: 1.6, reps: 8 },
  'tirage-vertical-poulie': { start: 45, gain: 1.2, reps: 10 },
  'curl-barre': { start: 25, gain: 0.9, reps: 10 },
  'squat-barre-libre': { start: 60, gain: 2.6, reps: 8 },
  'presse-a-cuisses': { start: 120, gain: 4, reps: 10 },
  'leg-curl-allonge': { start: 35, gain: 1.1, reps: 12 },
  'mollets-debout': { start: 60, gain: 1.5, reps: 15 },
}

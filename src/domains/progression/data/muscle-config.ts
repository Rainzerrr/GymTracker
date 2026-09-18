import type { Muscle } from '@domains/seances/types/muscle'

export type MuscleRegion = 'chest' | 'shoulders' | 'back' | 'arms' | 'core' | 'legs'

export const INDIRECT_SET_WEIGHT = 0.5

export const MUSCLE_REGIONS: { region: MuscleRegion; muscles: Muscle[] }[] = [
  { region: 'chest', muscles: ['pectoraux'] },
  { region: 'shoulders', muscles: ['delto_anterieur', 'delto_lateral', 'delto_posterieur'] },
  { region: 'back', muscles: ['dorsaux', 'haut_dos', 'trapezes', 'lombaires'] },
  { region: 'arms', muscles: ['biceps', 'triceps', 'avant_bras'] },
  { region: 'core', muscles: ['abdos', 'obliques'] },
  { region: 'legs', muscles: ['quadriceps', 'ischios', 'fessiers', 'adducteurs', 'mollets'] },
]

// Objectif hebdomadaire en séries effectives (1 série directe = 1, 1 série indirecte = 0,5)
export const WEEKLY_TARGET_SETS: Record<Muscle, number> = {
  pectoraux: 12,
  delto_anterieur: 6,
  delto_lateral: 10,
  delto_posterieur: 8,
  dorsaux: 12,
  haut_dos: 8,
  trapezes: 6,
  lombaires: 4,
  biceps: 10,
  triceps: 10,
  avant_bras: 6,
  abdos: 8,
  obliques: 6,
  quadriceps: 12,
  ischios: 10,
  fessiers: 10,
  adducteurs: 6,
  mollets: 8,
}

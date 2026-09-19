import type { MuscleGroup } from '../types/muscle-group'

const DEFAULT_INCREMENT_KG = 2.5
const DUMBBELL_INCREMENT_KG = 2
const LOWER_BODY_INCREMENT_KG = 5

const LOWER_BODY_GROUPS: MuscleGroup[] = ['quadriceps', 'ischios']
const LOADED_EQUIPMENT = ['Barre', 'Barre hexagonale', 'Machine']

// Plus petit saut de charge réaliste : les disques de 1,25 kg pour le haut du corps, plus gros
// pour les jambes, et les haltères montent par paliers de 2 kg.
export const getWeightIncrement = (equipment: string, muscleGroup: MuscleGroup | undefined) => {
  if (equipment === 'Haltères' || equipment === 'Kettlebell') {
    return DUMBBELL_INCREMENT_KG
  }

  const isLowerBody = muscleGroup !== undefined && LOWER_BODY_GROUPS.includes(muscleGroup)

  return isLowerBody && LOADED_EQUIPMENT.includes(equipment)
    ? LOWER_BODY_INCREMENT_KG
    : DEFAULT_INCREMENT_KG
}

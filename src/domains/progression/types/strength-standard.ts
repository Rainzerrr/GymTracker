// Seuils Débutant, Novice, Intermédiaire, Avancé, Élite
export type StandardLevels = [number, number, number, number, number]

export type StrengthStandard =
  | {
      kind: 'load'
      // 1RM estimée en kg de charge totale, pour un pratiquant de référence (80 kg)
      levels: StandardLevels
      // 2 quand la charge saisie est celle d'un seul haltère alors que les deux comptent
      handMultiplier: 1 | 2
      // Part du poids de corps déplacée (tractions, dips, pompes) ; 0 pour une charge externe seule
      bodyweightShare: number
    }
  | {
      kind: 'reps'
      levels: StandardLevels
      unit: 'reps' | 'seconds'
    }

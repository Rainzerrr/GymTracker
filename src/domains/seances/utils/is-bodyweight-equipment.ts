const BODYWEIGHT_EQUIPMENT = new Set(['Poids du corps', 'Barre de traction', 'Roulette'])

export const isBodyweightEquipment = (equipment: string): boolean =>
  BODYWEIGHT_EQUIPMENT.has(equipment)

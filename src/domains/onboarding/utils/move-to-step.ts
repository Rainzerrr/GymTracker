export type CarouselDirection = 'forward' | 'backward'

export type CarouselPosition = { index: number; direction: CarouselDirection }

// Nouvelle position après un déplacement : bornée aux étapes existantes, avec le sens du
// mouvement (il pilote le côté d'où glisse la nouvelle étape). Aucun changement hors bornes.
export const moveToStep = (
  current: CarouselPosition,
  target: number,
  stepCount: number,
): CarouselPosition => {
  const index = Math.max(0, Math.min(stepCount - 1, target))

  return index === current.index
    ? current
    : { index, direction: index > current.index ? 'forward' : 'backward' }
}

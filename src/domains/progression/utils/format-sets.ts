export const formatSets = (sets: number): string =>
  sets.toLocaleString('fr-FR', { maximumFractionDigits: 1 })

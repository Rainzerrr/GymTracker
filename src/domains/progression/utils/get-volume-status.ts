import type { VolumeStatus } from '../types/volume-status'

export const getVolumeStatus = (effectiveSets: number, targetSets: number): VolumeStatus => {
  if (effectiveSets <= 0) {
    return 'none'
  }

  const ratio = effectiveSets / targetSets

  if (ratio >= 1) {
    return 'target'
  }

  if (ratio >= 0.7) {
    return 'high'
  }

  if (ratio >= 0.35) {
    return 'medium'
  }

  return 'low'
}

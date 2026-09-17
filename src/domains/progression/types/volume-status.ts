import type { MuscleGroup } from '@domains/seances/types/muscle-group'

export type VolumeStatus = 'none' | 'under' | 'target'

export type MuscleVolume = {
  muscleGroup: MuscleGroup
  status: VolumeStatus
}

import type { Muscle } from '@domains/seances/types/muscle'

export type VolumeStatus = 'none' | 'low' | 'medium' | 'high' | 'target'

export type MuscleContribution = {
  exerciseId: string
  name: string
  thumbnailUrl: string
  sets: number
  isDirect: boolean
}

export type MuscleVolume = {
  muscle: Muscle
  status: VolumeStatus
  directSets: number
  indirectSets: number
  effectiveSets: number
  targetSets: number
  contributions: MuscleContribution[]
}

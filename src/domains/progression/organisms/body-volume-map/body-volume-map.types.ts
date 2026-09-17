import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import type { VolumeStatus } from '../../types/volume-status'

export type BodyView = 'front' | 'back'

export type MuscleVolumeDisplay = {
  muscleGroup: MuscleGroup
  label: string
  status: VolumeStatus
}

export type BodyVolumeMapProps = {
  bodyView: BodyView
  onBodyViewChange: (view: BodyView) => void
  muscles: MuscleVolumeDisplay[]
}

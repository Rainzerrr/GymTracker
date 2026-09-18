import type { Muscle } from '@domains/seances/types/muscle'
import type { MuscleVolume } from '../../types/volume-status'

export type BodyView = 'front' | 'back'

export type MuscleVolumeDisplay = MuscleVolume & {
  label: string
}

export type MuscleRegionDisplay = {
  label: string
  muscles: MuscleVolumeDisplay[]
}

export type BodyVolumeMapProps = {
  bodyView: BodyView
  onBodyViewChange: (view: BodyView) => void
  regions: MuscleRegionDisplay[]
  selectedMuscle: Muscle | null
  onSelectMuscle: (muscle: Muscle) => void
}

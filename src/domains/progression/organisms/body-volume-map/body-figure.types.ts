import type { Muscle } from '@domains/seances/types/muscle'
import type { VolumeStatus } from '../../types/volume-status'
import type { BodyView } from './body-volume-map.types'

export type BodyFigureProps = {
  view: BodyView
  statusByMuscle: Partial<Record<Muscle, VolumeStatus>>
  selectedMuscle: Muscle | null
  onSelectMuscle: (muscle: Muscle) => void
}

import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import type { VolumeStatus } from '../../types/volume-status'
import type { BodyView } from './body-volume-map.types'

export type BodyFigureProps = {
  view: BodyView
  statusByMuscle: Partial<Record<MuscleGroup, VolumeStatus>>
}

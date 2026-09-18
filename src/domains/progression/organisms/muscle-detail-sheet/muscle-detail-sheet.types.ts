import type { MuscleVolume } from '../../types/volume-status'

export type MuscleDetailSheetProps = {
  volume: MuscleVolume
  label: string
  onClose: () => void
}

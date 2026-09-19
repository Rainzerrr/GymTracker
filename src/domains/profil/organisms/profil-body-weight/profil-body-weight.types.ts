import type { BodyWeightEntry } from '../../utils/body-weight-history'

export type ProfilBodyWeightProps = {
  bodyWeightKg: number
  onChange: (value: number) => void
  history: BodyWeightEntry[]
  onRecord: () => void
  onRemoveEntry: (recordedAt: string) => void
}

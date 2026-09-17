import type { RirValue } from '../../types/rir-value'

export type RirSelectorProps = {
  value: RirValue | null
  onChange: (value: RirValue) => void
}

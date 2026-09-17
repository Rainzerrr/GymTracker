export type SegmentedToggleOption = {
  value: string
  label: string
}

export type SegmentedToggleProps = {
  options: SegmentedToggleOption[]
  value: string
  onChange: (value: string) => void
}

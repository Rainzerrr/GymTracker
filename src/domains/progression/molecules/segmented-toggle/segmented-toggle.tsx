import type { SegmentedToggleProps } from './segmented-toggle.types'
import './segmented-toggle.scss'

export const SegmentedToggle = ({ options, value, onChange }: SegmentedToggleProps) => {
  return (
    <div className="segmented-toggle">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented-toggle__option ${option.value === value ? 'segmented-toggle__option--active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

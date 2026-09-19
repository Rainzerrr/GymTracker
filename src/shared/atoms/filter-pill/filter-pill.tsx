import type { FilterPillProps } from './filter-pill.types'
import './filter-pill.scss'

export const FilterPill = ({ label, active, onClick }: FilterPillProps) => {
  return (
    <button
      type="button"
      className={`filter-pill ${active ? 'filter-pill--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

import type { MuscleBarProps } from './muscle-bar.types'
import './muscle-bar.scss'

export const MuscleBar = ({ label, meta, percent }: MuscleBarProps) => {
  return (
    <div className="muscle-bar">
      <div className="muscle-bar__header">
        <span className="muscle-bar__label">{label}</span>
        <span className="muscle-bar__meta">{meta}</span>
      </div>
      <span className="muscle-bar__track">
        <span className="muscle-bar__fill" style={{ width: `${percent}%` }} />
      </span>
    </div>
  )
}

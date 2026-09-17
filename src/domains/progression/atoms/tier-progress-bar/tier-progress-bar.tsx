import type { TierProgressBarProps } from './tier-progress-bar.types'
import './tier-progress-bar.scss'

export const TierProgressBar = ({ tier, progressPercent }: TierProgressBarProps) => {
  return (
    <span className="tier-progress-bar">
      <span
        className={`tier-progress-bar__fill tier-progress-bar__fill--${tier}`}
        style={{ width: `${progressPercent}%` }}
      />
    </span>
  )
}

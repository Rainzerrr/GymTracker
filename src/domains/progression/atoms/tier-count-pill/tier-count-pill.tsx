import type { TierCountPillProps } from './tier-count-pill.types'
import './tier-count-pill.scss'

export const TierCountPill = ({ tier, label, count }: TierCountPillProps) => {
  return (
    <span className="tier-count-pill">
      <span className={`tier-count-pill__dot tier-count-pill__dot--${tier}`} aria-hidden="true" />
      {label} · {count}
    </span>
  )
}

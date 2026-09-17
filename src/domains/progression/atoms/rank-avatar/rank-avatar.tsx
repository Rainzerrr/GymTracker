import type { RankAvatarProps } from './rank-avatar.types'
import './rank-avatar.scss'

const dumbbellIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path d="M4 9v6M2 10v4M20 9v6M22 10v4M7 12h10" strokeLinecap="round" />
    <rect x="5" y="7.5" width="3" height="9" rx="1" />
    <rect x="16" y="7.5" width="3" height="9" rx="1" />
  </svg>
)

export const RankAvatar = ({ tier, photoUrl, label }: RankAvatarProps) => {
  return (
    <span className={`rank-avatar rank-avatar--${tier}`}>
      {photoUrl ? <img src={photoUrl} alt={label} /> : dumbbellIcon}
    </span>
  )
}

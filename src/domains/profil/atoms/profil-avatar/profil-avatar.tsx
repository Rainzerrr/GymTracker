import type { ProfilAvatarProps } from './profil-avatar.types'
import './profil-avatar.scss'

const personIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
)

export const ProfilAvatar = ({ initials }: ProfilAvatarProps) => {
  return <span className="profil-avatar">{initials || personIcon}</span>
}

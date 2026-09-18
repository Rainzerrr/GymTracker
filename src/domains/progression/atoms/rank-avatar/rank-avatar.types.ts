import type { Tier } from '../../types/tier'

export type RankAvatarProps = {
  tier: Tier
  photoUrl?: string
  label: string
  size?: 'md' | 'lg'
}

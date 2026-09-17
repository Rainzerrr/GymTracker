import type { ReactNode } from 'react'
import './icon-chip.scss'

type IconChipProps = {
  icon: ReactNode
}

export const IconChip = ({ icon }: IconChipProps) => {
  return <span className="icon-chip">{icon}</span>
}

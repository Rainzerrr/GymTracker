import type { StatusDotProps } from './status-dot.types'
import './status-dot.scss'

export const StatusDot = ({ status }: StatusDotProps) => {
  return <span className={`status-dot status-dot--${status}`} aria-hidden="true" />
}

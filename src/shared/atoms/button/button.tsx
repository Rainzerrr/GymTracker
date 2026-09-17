import type { ButtonProps } from './button.types'
import './button.scss'

export const Button = ({
  label,
  variant = 'accent',
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick,
}: ButtonProps) => {
  const className = ['button', `button--${variant}`, fullWidth && 'button--full-width']
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}

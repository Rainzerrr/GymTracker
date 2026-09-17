export type ButtonVariant = 'accent' | 'outline'

export type ButtonProps = {
  label: string
  variant?: ButtonVariant
  fullWidth?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

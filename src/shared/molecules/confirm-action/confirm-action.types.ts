import type { ButtonVariant } from '@shared/atoms/button/button.types'

export type ConfirmActionProps = {
  triggerLabel: string
  triggerVariant?: ButtonVariant
  warning: string
  cancelLabel: string
  confirmLabel: string
  onConfirm: () => void
}

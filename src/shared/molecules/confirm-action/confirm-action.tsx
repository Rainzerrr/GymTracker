import { useState } from 'react'
import { Button } from '@shared/atoms/button'
import type { ConfirmActionProps } from './confirm-action.types'
import './confirm-action.scss'

// Action destructive en deux temps : un premier bouton, puis un encart d'avertissement à confirmer.
export const ConfirmAction = ({
  triggerLabel,
  triggerVariant = 'danger',
  warning,
  cancelLabel,
  confirmLabel,
  onConfirm,
}: ConfirmActionProps) => {
  const [isConfirming, setIsConfirming] = useState(false)

  if (!isConfirming) {
    return (
      <Button
        label={triggerLabel}
        variant={triggerVariant}
        fullWidth
        onClick={() => setIsConfirming(true)}
      />
    )
  }

  return (
    <div className="confirm-action">
      <p className="confirm-action__warning">{warning}</p>
      <div className="confirm-action__actions">
        <Button
          label={cancelLabel}
          variant="outline"
          fullWidth
          onClick={() => setIsConfirming(false)}
        />
        <Button label={confirmLabel} variant="danger" fullWidth onClick={onConfirm} />
      </div>
    </div>
  )
}

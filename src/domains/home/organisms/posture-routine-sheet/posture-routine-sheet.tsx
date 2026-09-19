import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { BottomSheet } from '@shared/organisms/bottom-sheet'
import type { PostureRoutineSheetProps } from './posture-routine-sheet.types'
import './posture-routine-sheet.scss'

export const PostureRoutineSheet = ({
  steps,
  isValidated,
  onValidate,
  onClose,
}: PostureRoutineSheetProps) => {
  const { t } = useTranslation('home')
  const [doneSteps, setDoneSteps] = useState<number[]>([])

  const toggleStep = (index: number) =>
    setDoneSteps((current) =>
      current.includes(index) ? current.filter((step) => step !== index) : [...current, index],
    )

  const handleValidate = () => {
    onValidate()
    onClose()
  }

  return (
    <BottomSheet
      title={t('postureRoutine.sheetTitle')}
      eyebrow={t('postureRoutine.sheetEyebrow')}
      onClose={onClose}
    >
      <ul className="posture-routine-sheet__steps">
        {steps.map((step, index) => (
          <li key={`${index}-${step}`}>
            <label className="posture-routine-sheet__step">
              <input
                type="checkbox"
                className="posture-routine-sheet__checkbox"
                checked={isValidated || doneSteps.includes(index)}
                disabled={isValidated}
                onChange={() => toggleStep(index)}
              />
              <span className="posture-routine-sheet__label">{step}</span>
            </label>
          </li>
        ))}
      </ul>
      {!isValidated && (
        <Button
          label={t('postureRoutine.validate')}
          variant="accent"
          fullWidth
          onClick={handleValidate}
        />
      )}
    </BottomSheet>
  )
}

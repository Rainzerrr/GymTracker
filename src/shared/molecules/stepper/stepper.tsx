import { useTranslation } from 'react-i18next'
import type { StepperProps } from './stepper.types'
import './stepper.scss'

export const Stepper = ({ value, min = 1, max = 10, onChange }: StepperProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={t('actions.decrease')}
      >
        −
      </button>
      <span className="stepper__value">{value}</span>
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={t('actions.increase')}
      >
        +
      </button>
    </div>
  )
}

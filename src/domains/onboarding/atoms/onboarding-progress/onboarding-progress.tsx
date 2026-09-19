import { useTranslation } from 'react-i18next'
import './onboarding-progress.scss'

type OnboardingProgressProps = {
  count: number
  current: number
  onSelect: (index: number) => void
}

export const OnboardingProgress = ({ count, current, onSelect }: OnboardingProgressProps) => {
  const { t } = useTranslation('onboarding')

  return (
    <ol className="onboarding-progress">
      {Array.from({ length: count }, (_unused, index) => {
        const stateClass =
          index < current
            ? 'onboarding-progress__bar--done'
            : index === current
              ? 'onboarding-progress__bar--current'
              : ''

        return (
          <li key={index} className="onboarding-progress__item">
            <button
              type="button"
              className="onboarding-progress__button"
              aria-label={t('aria.step', { current: index + 1, total: count })}
              aria-current={index === current ? 'step' : undefined}
              onClick={() => onSelect(index)}
            >
              <span className={`onboarding-progress__bar ${stateClass}`} />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

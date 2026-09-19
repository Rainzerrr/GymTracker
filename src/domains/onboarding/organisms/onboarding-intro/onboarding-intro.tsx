import { useTranslation } from 'react-i18next'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import { delayStyle } from '../../utils/delay-style'
import './onboarding-intro.scss'

export const OnboardingIntro = () => {
  const { t } = useTranslation('onboarding')
  const lines = t('intro.lines', { returnObjects: true }) as string[]

  const title = lines.map((line, index) => (
    <span
      key={line}
      className={`onboarding-intro__line onboarding-intro__line--${index}`}
      style={delayStyle(0.1 + index * 0.14)}
    >
      {line}
    </span>
  ))

  return (
    <OnboardingSlide eyebrow={t('intro.eyebrow')} title={title} text={t('intro.text')}>
      <div className="onboarding-intro__stage">
        <span className="onboarding-intro__pulse" />
        <span className="onboarding-intro__pulse onboarding-intro__pulse--late" />
        <svg className="onboarding-intro__mark" viewBox="60 130 392 252" aria-hidden="true">
          <rect
            className="onboarding-intro__plate onboarding-intro__plate--left"
            x="90"
            y="156"
            width="56"
            height="200"
            rx="20"
          />
          <rect
            className="onboarding-intro__collar onboarding-intro__collar--left"
            x="150"
            y="196"
            width="24"
            height="120"
            rx="10"
          />
          <rect className="onboarding-intro__bar" x="174" y="236" width="164" height="40" rx="10" />
          <rect
            className="onboarding-intro__collar onboarding-intro__collar--right"
            x="338"
            y="196"
            width="24"
            height="120"
            rx="10"
          />
          <rect
            className="onboarding-intro__plate onboarding-intro__plate--right"
            x="366"
            y="156"
            width="56"
            height="200"
            rx="20"
          />
        </svg>
        <span
          className="onboarding-intro__chip onboarding-intro__chip--rank"
          style={delayStyle(0.9)}
        >
          <span className="onboarding-intro__spark" />
          {t('intro.rankChip')}
        </span>
        <span className="onboarding-intro__chip onboarding-intro__chip--xp" style={delayStyle(1.1)}>
          {t('intro.xpChip')}
        </span>
        <span
          className="onboarding-intro__chip onboarding-intro__chip--streak"
          style={delayStyle(1.3)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.5-2-1-2 1 3-1 4-2 4a2 2 0 01-2-2c0-3 3-4 2-9z" />
          </svg>
          {t('intro.streakChip')}
        </span>
      </div>
    </OnboardingSlide>
  )
}

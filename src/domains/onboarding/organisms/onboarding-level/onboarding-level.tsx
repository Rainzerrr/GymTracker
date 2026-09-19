import { useTranslation } from 'react-i18next'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import { delayStyle } from '../../utils/delay-style'
import './onboarding-level.scss'

export const OnboardingLevel = () => {
  const { t } = useTranslation('onboarding')
  const titles = t('level.titles', { returnObjects: true }) as string[]

  return (
    <OnboardingSlide eyebrow={t('level.eyebrow')} title={t('level.title')} text={t('level.text')}>
      <div className="onboarding-level">
        <div className="onboarding-level__ring-wrap">
          <svg className="onboarding-level__ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="onboarding-level__track" cx="60" cy="60" r="52" />
            <circle
              className="onboarding-level__progress"
              cx="60"
              cy="60"
              r="52"
              pathLength="100"
            />
          </svg>
          <div className="onboarding-level__center">
            <span className="onboarding-level__label">{t('level.levelLabel')}</span>
            <span className="onboarding-level__value">{t('level.levelValue')}</span>
            <span className="onboarding-level__title">{t('level.levelTitle')}</span>
          </div>
          <span className="onboarding-level__xp">
            +<span className="onboarding-level__xp-count" /> {t('level.xpSuffix')}
          </span>
          <span className="onboarding-level__streak">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.5-2-1-2 1 3-1 4-2 4a2 2 0 01-2-2c0-3 3-4 2-9z" />
            </svg>
            {t('level.streak')}
          </span>
        </div>

        <ol className="onboarding-level__titles">
          {titles.map((title, index) => (
            <li
              key={title}
              className={`onboarding-level__step ${index === 0 ? 'onboarding-level__step--current' : ''}`}
              style={delayStyle(1.9 + index * 0.18)}
            >
              {title}
            </li>
          ))}
        </ol>
      </div>
    </OnboardingSlide>
  )
}

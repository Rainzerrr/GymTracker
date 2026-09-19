import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import { delayStyle } from '../../utils/delay-style'
import './onboarding-features.scss'

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    {path}
  </svg>
)

const FEATURES = [
  {
    id: 'sessions',
    icon: icon(<path d="M4 10v4M7 8v8M17 8v8M20 10v4M7 12h10" strokeLinecap="round" />),
  },
  {
    id: 'planning',
    icon: icon(
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      </>,
    ),
  },
  {
    id: 'rest',
    icon: icon(
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2M9.5 3h5" strokeLinecap="round" />
      </>,
    ),
  },
  {
    id: 'history',
    icon: icon(<path d="M4 19V10M10 19V5M16 19v-7M21 19H3" strokeLinecap="round" />),
  },
  {
    id: 'backup',
    icon: icon(
      <path
        d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
    ),
  },
  {
    id: 'offline',
    icon: icon(
      <>
        <path d="M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0" strokeLinecap="round" />
        <circle cx="12" cy="19" r="1" />
        <path d="M4 4l16 16" strokeLinecap="round" />
      </>,
    ),
  },
] as const

export const OnboardingFeatures = () => {
  const { t } = useTranslation('onboarding')

  return (
    <OnboardingSlide
      eyebrow={t('features.eyebrow')}
      title={t('features.title')}
      text={t('features.text')}
    >
      <ul className="onboarding-features">
        {FEATURES.map((feature, index) => (
          <li
            key={feature.id}
            className="onboarding-features__item"
            style={delayStyle(0.25 + index * 0.1)}
          >
            <span className="onboarding-features__icon">{feature.icon}</span>
            <span className="onboarding-features__title">
              {t(`features.items.${feature.id}.title`)}
            </span>
            <span className="onboarding-features__text">
              {t(`features.items.${feature.id}.text`)}
            </span>
          </li>
        ))}
      </ul>
    </OnboardingSlide>
  )
}

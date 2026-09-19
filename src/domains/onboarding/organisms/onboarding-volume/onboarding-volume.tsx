import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import { delayStyle } from '../../utils/delay-style'
import './onboarding-volume.scss'

const WEEKLY_GOAL = 12

const MUSCLES = [
  { id: 'pectoraux', done: 14 },
  { id: 'dos', done: 12 },
  { id: 'epaules', done: 9 },
  { id: 'quadriceps', done: 6 },
  { id: 'bras', done: 4 },
] as const

const getFillLevel = (done: number) => {
  const ratio = done / WEEKLY_GOAL

  if (ratio >= 1) {
    return 'reached'
  }

  return ratio >= 0.66 ? 'high' : ratio >= 0.4 ? 'medium' : 'low'
}

export const OnboardingVolume = () => {
  const { t } = useTranslation('onboarding')

  return (
    <OnboardingSlide
      eyebrow={t('volume.eyebrow')}
      title={t('volume.title')}
      text={t('volume.text')}
    >
      <div className="onboarding-volume">
        <p className="onboarding-volume__goal">{t('volume.target', { count: WEEKLY_GOAL })}</p>
        <ul className="onboarding-volume__list">
          {MUSCLES.map((muscle, index) => {
            const widthPercent = Math.min(100, (muscle.done / WEEKLY_GOAL) * 100)
            const style = {
              ...delayStyle(0.3 + index * 0.16),
              '--onboarding-volume-width': `${widthPercent}%`,
            } as CSSProperties

            return (
              <li key={muscle.id} className="onboarding-volume__row" style={style}>
                <span className="onboarding-volume__name">{t(`volume.muscles.${muscle.id}`)}</span>
                <span className="onboarding-volume__track">
                  <span
                    className={`onboarding-volume__fill onboarding-volume__fill--${getFillLevel(muscle.done)}`}
                  />
                </span>
                <span className="onboarding-volume__count">
                  {t('volume.sets', { done: muscle.done, goal: WEEKLY_GOAL })}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </OnboardingSlide>
  )
}

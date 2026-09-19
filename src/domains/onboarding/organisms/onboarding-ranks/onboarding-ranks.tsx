import { useTranslation } from 'react-i18next'
import { RankAvatar } from '@domains/progression/atoms/rank-avatar'
import { TIERS } from '@domains/progression/types/tier'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import { delayStyle } from '../../utils/delay-style'
import './onboarding-ranks.scss'

const EXERCISE_PHOTO_URL = '/images/exercises/thumbs/squat-barbell.webp'
const SUB_LEVELS = [1, 2, 3]

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const OnboardingRanks = () => {
  const { t } = useTranslation('onboarding')
  const points = t('ranks.points', { returnObjects: true }) as string[]
  const exercise = t('ranks.exercise')

  return (
    <OnboardingSlide eyebrow={t('ranks.eyebrow')} title={t('ranks.title')} text={t('ranks.text')}>
      <div className="onboarding-ranks">
        <div className="onboarding-ranks__ladder">
          <span className="onboarding-ranks__rail" />
          <ol className="onboarding-ranks__tiers">
            {TIERS.map((tier, index) => (
              <li
                key={tier}
                className="onboarding-ranks__tier"
                style={delayStyle(0.35 + index * 0.3)}
              >
                <span className="onboarding-ranks__avatar">
                  <RankAvatar tier={tier} label={t(`ranks.tiers.${tier}`)} />
                </span>
                <span className="onboarding-ranks__tier-name">{t(`ranks.tiers.${tier}`)}</span>
                <span className="onboarding-ranks__steps" aria-hidden="true">
                  {SUB_LEVELS.map((level) => (
                    <span key={level} className="onboarding-ranks__step" />
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="onboarding-ranks__card" style={delayStyle(1.7)}>
          <span className="onboarding-ranks__card-avatar">
            <span className="onboarding-ranks__card-avatar-layer onboarding-ranks__card-avatar-layer--before">
              <RankAvatar tier="argent" photoUrl={EXERCISE_PHOTO_URL} label={exercise} />
            </span>
            <span className="onboarding-ranks__card-avatar-layer onboarding-ranks__card-avatar-layer--after">
              <RankAvatar tier="or" photoUrl={EXERCISE_PHOTO_URL} label={exercise} />
            </span>
          </span>
          <div className="onboarding-ranks__card-body">
            <span className="onboarding-ranks__card-name">{exercise}</span>
            <span className="onboarding-ranks__card-rank">
              <span className="onboarding-ranks__rank-label onboarding-ranks__rank-label--before">
                {t('ranks.rankBefore')}
              </span>
              <span className="onboarding-ranks__rank-label onboarding-ranks__rank-label--after">
                {t('ranks.rankAfter')}
              </span>
            </span>
            <span className="onboarding-ranks__bar">
              <span className="onboarding-ranks__bar-fill" />
            </span>
          </div>
          <span className="onboarding-ranks__unlocked">{t('ranks.unlocked')}</span>
        </div>

        <ul className="onboarding-ranks__points">
          {points.map((point, index) => (
            <li
              key={point}
              className="onboarding-ranks__point"
              style={delayStyle(2.9 + index * 0.15)}
            >
              {checkIcon}
              {point}
            </li>
          ))}
        </ul>
      </div>
    </OnboardingSlide>
  )
}

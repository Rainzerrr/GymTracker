import { useTranslation } from 'react-i18next'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import { delayStyle } from '../../utils/delay-style'
import './onboarding-target.scss'

const EXERCISE_PHOTO_URL = '/images/exercises/thumbs/squat-barbell.webp'

type FlipFieldProps = { label: string; before: string; after: string }

// Une valeur qui change : l'ancienne monte et s'efface, la nouvelle arrive par le bas.
const FlipField = ({ label, before, after }: FlipFieldProps) => (
  <div className="onboarding-target__field">
    <span className="onboarding-target__field-label">{label}</span>
    <span className="onboarding-target__field-value">
      <span className="onboarding-target__value onboarding-target__value--before">{before}</span>
      <span className="onboarding-target__value onboarding-target__value--after">{after}</span>
    </span>
  </div>
)

export const OnboardingTarget = () => {
  const { t } = useTranslation('onboarding')
  const points = t('target.points', { returnObjects: true }) as string[]

  return (
    <OnboardingSlide
      eyebrow={t('target.eyebrow')}
      title={t('target.title')}
      text={t('target.text')}
    >
      <div className="onboarding-target">
        <div className="onboarding-target__card">
          <div className="onboarding-target__head">
            <img className="onboarding-target__photo" src={EXERCISE_PHOTO_URL} alt="" />
            <div className="onboarding-target__head-text">
              <span className="onboarding-target__name">{t('target.exercise')}</span>
              <span className="onboarding-target__set">{t('target.setLabel')}</span>
            </div>
          </div>

          <div className="onboarding-target__history">
            <span className="onboarding-target__last">{t('target.last')}</span>
            <span className="onboarding-target__goal">
              {t('target.goal')}
              <span className="onboarding-target__reason"> · {t('target.reason')}</span>
            </span>
          </div>

          <div className="onboarding-target__fields">
            <FlipField label={t('target.weight')} before="75" after="80" />
            <FlipField label={t('target.reps')} before="10" after="6" />
            <div className="onboarding-target__field">
              <span className="onboarding-target__field-label">{t('target.rir')}</span>
              <span className="onboarding-target__field-value">
                <span className="onboarding-target__value">—</span>
              </span>
            </div>
          </div>

          <span className="onboarding-target__validate">{t('target.validate')}</span>
        </div>

        <ul className="onboarding-target__points">
          {points.map((point, index) => (
            <li
              key={point}
              className="onboarding-target__point"
              style={delayStyle(3 + index * 0.15)}
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </OnboardingSlide>
  )
}

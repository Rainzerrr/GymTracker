import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { RankAvatar } from '@domains/progression/atoms/rank-avatar'
import { OnboardingSlide } from '../../molecules/onboarding-slide'
import type { OnboardingStartProps } from './onboarding-start.types'
import './onboarding-start.scss'

const SPARK_COUNT = 8

const sparkStyle = (index: number): CSSProperties =>
  ({
    '--onboarding-angle': `${(360 / SPARK_COUNT) * index}deg`,
    '--onboarding-delay': `${0.9 + index * 0.12}s`,
  }) as CSSProperties

export const OnboardingStart = ({
  hasNoSessions,
  onInstallStarter,
  onCreateSession,
  onSeeRanks,
  onFinish,
}: OnboardingStartProps) => {
  const { t } = useTranslation('onboarding')

  return (
    <OnboardingSlide
      eyebrow={t('start.eyebrow')}
      title={t('start.title')}
      text={hasNoSessions ? t('start.textFirst') : t('start.textReturning')}
    >
      <div className="onboarding-start">
        <div className="onboarding-start__hero">
          <span className="onboarding-start__ring" />
          <span className="onboarding-start__ring onboarding-start__ring--late" />
          {Array.from({ length: SPARK_COUNT }, (_unused, index) => (
            <span key={index} className="onboarding-start__spark" style={sparkStyle(index)} />
          ))}
          <div className="onboarding-start__medal">
            <div className="onboarding-start__medal-scale">
              <RankAvatar tier="platine" size="lg" label={t('start.rankLabel')} />
            </div>
          </div>
        </div>

        <div className="onboarding-start__actions">
          {hasNoSessions ? (
            <>
              <Button
                label={t('start.installStarter')}
                variant="accent"
                fullWidth
                onClick={onInstallStarter}
              />
              <Button
                label={t('start.createSession')}
                variant="outline"
                fullWidth
                onClick={onCreateSession}
              />
              <button type="button" className="onboarding-start__later" onClick={onFinish}>
                {t('start.later')}
              </button>
            </>
          ) : (
            <>
              <Button label={t('start.go')} variant="accent" fullWidth onClick={onFinish} />
              <Button
                label={t('start.seeRanks')}
                variant="outline"
                fullWidth
                onClick={onSeeRanks}
              />
            </>
          )}
        </div>
      </div>
    </OnboardingSlide>
  )
}

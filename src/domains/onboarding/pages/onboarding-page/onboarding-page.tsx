import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useStarterProgram } from '@domains/seances/hooks/use-starter-program'
import { OnboardingProgress } from '../../atoms/onboarding-progress'
import { ONBOARDING_STEPS } from '../../data/onboarding-steps'
import { useOnboardingCarousel } from '../../hooks/use-onboarding-carousel'
import { useOnboardingStatus } from '../../hooks/use-onboarding-status'
import { OnboardingStage } from '../../organisms/onboarding-stage'
import './onboarding-page.scss'

export const OnboardingPage = () => {
  const { t } = useTranslation('onboarding')
  const navigate = useNavigate()
  const { sessions } = useSessions()
  const { installStarterProgram } = useStarterProgram()
  const { markSeen } = useOnboardingStatus()
  const carousel = useOnboardingCarousel(ONBOARDING_STEPS.length)

  const step = ONBOARDING_STEPS[carousel.index]

  // Toute sortie (passer, terminer, action finale) compte comme « vu ».
  const leaveTo = (destination: string) => {
    markSeen()
    navigate(destination, { replace: true })
  }

  const startProps = {
    hasNoSessions: sessions.length === 0,
    onInstallStarter: () => {
      installStarterProgram()
      leaveTo('/')
    },
    onCreateSession: () => leaveTo('/seances/nouvelle'),
    onSeeRanks: () => leaveTo('/progression/rangs'),
    onFinish: () => leaveTo('/'),
  }

  return (
    <section
      className={`onboarding-page onboarding-page--${step.tone}`}
      aria-roledescription="carousel"
      aria-label={t('aria.carousel')}
      {...carousel.swipeHandlers}
    >
      <span className="onboarding-page__glow" aria-hidden="true" />
      <header className="onboarding-page__top">
        <OnboardingProgress
          count={ONBOARDING_STEPS.length}
          current={carousel.index}
          onSelect={carousel.goTo}
        />
        {!carousel.isLast && (
          <button type="button" className="onboarding-page__skip" onClick={() => leaveTo('/')}>
            {t('controls.skip')}
          </button>
        )}
      </header>
      <div className="onboarding-page__stage">
        <OnboardingStage stepId={step.id} direction={carousel.direction} startProps={startProps} />
      </div>
      {!carousel.isLast && (
        <footer className="onboarding-page__footer">
          <Button label={t('controls.next')} variant="accent" fullWidth onClick={carousel.next} />
        </footer>
      )}
    </section>
  )
}

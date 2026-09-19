import type { CarouselDirection } from '../../utils/move-to-step'
import type { OnboardingStepId } from '../../data/onboarding-steps'
import { OnboardingFeatures } from '../onboarding-features'
import { OnboardingIntro } from '../onboarding-intro'
import { OnboardingLevel } from '../onboarding-level'
import { OnboardingRanks } from '../onboarding-ranks'
import { OnboardingStart } from '../onboarding-start'
import type { OnboardingStartProps } from '../onboarding-start'
import { OnboardingTarget } from '../onboarding-target'
import { OnboardingVolume } from '../onboarding-volume'
import './onboarding-stage.scss'

type OnboardingStageProps = {
  stepId: OnboardingStepId
  direction: CarouselDirection
  startProps: OnboardingStartProps
}

// L'étape est remontée à chaque changement (`key`) : ses animations repartent du début, et le
// cadre glisse depuis le côté d'où l'on vient.
export const OnboardingStage = ({ stepId, direction, startProps }: OnboardingStageProps) => {
  const content = {
    intro: <OnboardingIntro />,
    ranks: <OnboardingRanks />,
    target: <OnboardingTarget />,
    level: <OnboardingLevel />,
    volume: <OnboardingVolume />,
    features: <OnboardingFeatures />,
    start: <OnboardingStart {...startProps} />,
  }[stepId]

  return (
    <div key={stepId} className={`onboarding-stage onboarding-stage--${direction}`}>
      {content}
    </div>
  )
}

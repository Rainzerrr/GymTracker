// Teinte de l'halo lumineux derrière l'étape : elle change en douceur d'une étape à l'autre.
export type OnboardingTone = 'accent' | 'platine' | 'argent' | 'bronze'

export type OnboardingStepId =
  'intro' | 'ranks' | 'target' | 'level' | 'volume' | 'features' | 'start'

export type OnboardingStep = { id: OnboardingStepId; tone: OnboardingTone }

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'intro', tone: 'accent' },
  { id: 'ranks', tone: 'platine' },
  { id: 'target', tone: 'accent' },
  { id: 'level', tone: 'accent' },
  { id: 'volume', tone: 'argent' },
  { id: 'features', tone: 'bronze' },
  { id: 'start', tone: 'platine' },
]

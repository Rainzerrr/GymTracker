import type { ThemePreference } from '@shared/utils/theme/apply-theme'

export type AppSettings = {
  theme: ThemePreference
  // Son et vibration quand le repos entre deux séries se termine
  restAlert: boolean
  // Empêche la mise en veille de l'écran pendant une séance
  keepScreenAwake: boolean
  // Repos proposé à l'ajout d'un exercice dans une séance (voir REST_OPTIONS)
  defaultRest: string
  postureRoutineEnabled: boolean
}

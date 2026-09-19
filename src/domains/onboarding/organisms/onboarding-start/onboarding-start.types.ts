export type OnboardingStartProps = {
  // Premier lancement, sans aucune séance : on propose de démarrer un programme.
  hasNoSessions: boolean
  onInstallStarter: () => void
  onCreateSession: () => void
  onSeeRanks: () => void
  onFinish: () => void
}

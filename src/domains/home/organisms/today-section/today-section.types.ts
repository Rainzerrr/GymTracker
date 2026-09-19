export type TodaySectionProps = {
  streakCurrent: number
  streakTrend: boolean[]
  postureEnabled: boolean
  postureSteps: string[]
  postureValidated: boolean
  onValidatePosture: () => void
}

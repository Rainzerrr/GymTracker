import type { ExerciseProgressSeries } from '../../types/exercise-progress-series'
import type { HistoryEntry } from '../../types/history-entry'

export type HistoryLogView = 'sessions' | 'chart'

export type HistoryLogProps = {
  activeView: HistoryLogView
  onViewChange: (view: HistoryLogView) => void
  totalSessionsCount: number
  entries: HistoryEntry[]
  charts: ExerciseProgressSeries[]
  selectedExerciseId: string
  onSelectExercise: (exerciseId: string) => void
}

import { HistoryChartView } from './history-chart-view'
import { HistorySessionsView } from './history-sessions-view'
import type { HistoryLogProps } from './history-log.types'
import './history-log.scss'

export const HistoryLog = ({
  activeView,
  entries,
  charts,
  selectedExerciseId,
  onSelectExercise,
  onSelectEntry,
}: HistoryLogProps) => {
  return (
    <div className="history-log">
      {activeView === 'sessions' ? (
        <HistorySessionsView entries={entries} onSelectEntry={onSelectEntry} />
      ) : (
        <HistoryChartView
          charts={charts}
          selectedExerciseId={selectedExerciseId}
          onSelectExercise={onSelectExercise}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { PageTemplate } from '@shared/templates/page-template'
import { useProgressionHistory } from '../../hooks/use-progression-history'
import { HistoryLog } from '../../organisms/history-log'
import type { HistoryLogView } from '../../organisms/history-log'

export const ProgressionPage = () => {
  const { totalSessionsCount, entries, charts } = useProgressionHistory()
  const [activeView, setActiveView] = useState<HistoryLogView>('sessions')
  const [selectedExerciseId, setSelectedExerciseId] = useState(charts[0]?.exerciseId ?? '')

  return (
    <PageTemplate>
      <HistoryLog
        activeView={activeView}
        onViewChange={setActiveView}
        totalSessionsCount={totalSessionsCount}
        entries={entries}
        charts={charts}
        selectedExerciseId={selectedExerciseId}
        onSelectExercise={setSelectedExerciseId}
      />
    </PageTemplate>
  )
}

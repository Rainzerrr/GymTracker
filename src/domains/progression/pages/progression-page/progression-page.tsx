import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageTemplate } from '@shared/templates/page-template'
import { useProgressionHistory } from '../../hooks/use-progression-history'
import { HistoryLog, HistoryLogHeader } from '../../organisms/history-log'
import type { HistoryLogView } from '../../organisms/history-log'

export const ProgressionPage = () => {
  const navigate = useNavigate()
  const { totalSessionsCount, entries, charts } = useProgressionHistory()
  const [activeView, setActiveView] = useState<HistoryLogView>('sessions')
  const [selectedExerciseId, setSelectedExerciseId] = useState(charts[0]?.exerciseId ?? '')

  return (
    <PageTemplate
      header={
        <HistoryLogHeader
          activeView={activeView}
          onViewChange={setActiveView}
          totalSessionsCount={totalSessionsCount}
        />
      }
    >
      <HistoryLog
        activeView={activeView}
        entries={entries}
        charts={charts}
        selectedExerciseId={selectedExerciseId}
        onSelectExercise={setSelectedExerciseId}
        onSelectEntry={(entryId) => navigate(`/progression/seances/${entryId}`)}
      />
    </PageTemplate>
  )
}

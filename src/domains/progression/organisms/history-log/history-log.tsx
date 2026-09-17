import { useTranslation } from 'react-i18next'
import { SegmentedToggle } from '../../molecules/segmented-toggle'
import { HistoryChartView } from './history-chart-view'
import { HistorySessionsView } from './history-sessions-view'
import type { HistoryLogProps } from './history-log.types'
import './history-log.scss'

export const HistoryLog = ({
  activeView,
  onViewChange,
  totalSessionsCount,
  entries,
  charts,
  selectedExerciseId,
  onSelectExercise,
}: HistoryLogProps) => {
  const { t } = useTranslation('progression')

  return (
    <div className="history-log">
      <div className="history-log__header">
        <span className="history-log__title">{t('history.headerTitle')}</span>
        <p className="history-log__subtitle">
          {t('history.subtitle', { count: totalSessionsCount })}
        </p>
      </div>

      <SegmentedToggle
        value={activeView}
        onChange={(value) => onViewChange(value as HistoryLogProps['activeView'])}
        options={[
          { value: 'sessions', label: t('history.toggle.sessions') },
          { value: 'chart', label: t('history.toggle.chart') },
        ]}
      />

      {activeView === 'sessions' ? (
        <HistorySessionsView entries={entries} />
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

import { useTranslation } from 'react-i18next'
import { FilterPill } from '@shared/atoms/filter-pill'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'
import { ExerciseProgressChart } from '../exercise-progress-chart'
import type { ExerciseProgressSeries } from '../../types/exercise-progress-series'

const upIcon = (
  <svg
    className="history-log__milestone-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type HistoryChartViewProps = {
  charts: ExerciseProgressSeries[]
  selectedExerciseId: string
  onSelectExercise: (exerciseId: string) => void
}

export const HistoryChartView = ({
  charts,
  selectedExerciseId,
  onSelectExercise,
}: HistoryChartViewProps) => {
  const { t } = useTranslation('progression')
  const selected = charts.find((chart) => chart.exerciseId === selectedExerciseId) ?? charts[0]

  if (!selected) {
    return <p className="history-log__empty">{t('history.chartEmpty')}</p>
  }

  return (
    <div>
      <div className="history-log__chart-picker">
        {charts.map((chart) => (
          <FilterPill
            key={chart.exerciseId}
            label={chart.exerciseName}
            active={chart.exerciseId === selected.exerciseId}
            onClick={() => onSelectExercise(chart.exerciseId)}
          />
        ))}
      </div>

      <ExerciseProgressChart series={selected} />

      {selected.milestone && (
        <div className="history-log__milestone">
          <SectionLabel label={t('history.milestoneLabel')} />
          <ListRow
            title={selected.milestone.title}
            subtitle={selected.milestone.subtitle}
            trailing={upIcon}
          />
        </div>
      )}
    </div>
  )
}

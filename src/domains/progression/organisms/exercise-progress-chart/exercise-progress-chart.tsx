import { useTranslation } from 'react-i18next'
import { buildChartPoints } from '../../utils/build-chart-points'
import { formatProgressValue } from '../../utils/format-progress-value'
import { getSubLevelRoman } from '../../utils/get-sub-level-roman'
import type { ExerciseProgressChartProps } from './exercise-progress-chart.types'
import './exercise-progress-chart.scss'

export const ExerciseProgressChart = ({ series }: ExerciseProgressChartProps) => {
  const { t } = useTranslation('progression')
  const points = buildChartPoints(series.points)
  const first = points[0]
  const last = points[points.length - 1]
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className="exercise-progress-chart">
      <div className="exercise-progress-chart__head">
        <span className="exercise-progress-chart__name">{series.exerciseName}</span>
        <span className="exercise-progress-chart__tier">
          {t(`tiers.${series.tier}`)} {getSubLevelRoman(series.subLevel)}
        </span>
      </div>

      <svg
        className="exercise-progress-chart__svg"
        viewBox="0 0 320 140"
        aria-label={series.exerciseName}
      >
        <line x1="16" y1="122" x2="304" y2="122" className="exercise-progress-chart__axis" />
        <polyline points={polyline} className="exercise-progress-chart__line" />
        {points.slice(0, -1).map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3.5"
            className="exercise-progress-chart__dot"
          />
        ))}
        <circle cx={last.x} cy={last.y} r="5" className="exercise-progress-chart__dot--last" />
        <text x={first.x} y={first.y - 8} className="exercise-progress-chart__value-label">
          {formatProgressValue(first.value, series.unit)}
        </text>
        <text x={last.x - 34} y={last.y - 8} className="exercise-progress-chart__value-label--last">
          {formatProgressValue(last.value, series.unit)}
        </text>
        <text x="16" y="136" className="exercise-progress-chart__period-label">
          {t('history.chart.sessionsAgo', { count: points.length - 1 })}
        </text>
        <text x="262" y="136" className="exercise-progress-chart__period-label">
          {t('history.chart.today')}
        </text>
      </svg>
    </div>
  )
}

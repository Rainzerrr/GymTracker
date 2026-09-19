import { useTranslation } from 'react-i18next'
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  PLOT_BOTTOM,
  PLOT_LEFT,
  PLOT_RIGHT,
  buildChartPoints,
} from '../../utils/build-chart-points'
import { formatProgressValue } from '../../utils/format-progress-value'
import { getSubLevelRoman } from '../../utils/get-sub-level-roman'
import type { ExerciseProgressChartProps } from './exercise-progress-chart.types'
import './exercise-progress-chart.scss'

const MAX_DATE_LABELS = 4

// Picks evenly spread indexes (always including the first and last) so the
// date labels never crowd each other on long series.
const getLabelledIndexes = (count: number): Set<number> => {
  if (count <= MAX_DATE_LABELS) {
    return new Set(Array.from({ length: count }, (_unused, index) => index))
  }

  return new Set(
    Array.from({ length: MAX_DATE_LABELS }, (_unused, slot) =>
      Math.round((slot * (count - 1)) / (MAX_DATE_LABELS - 1)),
    ),
  )
}

export const ExerciseProgressChart = ({ series }: ExerciseProgressChartProps) => {
  const { t } = useTranslation('progression')
  const { points, ticks } = buildChartPoints(series.points)
  const last = points[points.length - 1]
  const hasTrend = points.length > 1
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')
  const labelledIndexes = getLabelledIndexes(points.length)

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
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        aria-label={series.exerciseName}
      >
        {ticks.map((tick, index) => (
          <g key={tick.value}>
            <line
              x1={PLOT_LEFT}
              y1={tick.y}
              x2={PLOT_RIGHT}
              y2={tick.y}
              className={
                index === 0 ? 'exercise-progress-chart__axis' : 'exercise-progress-chart__grid'
              }
            />
            <text
              x={PLOT_LEFT - 8}
              y={tick.y + 3.5}
              className="exercise-progress-chart__tick-label"
            >
              {tick.value.toLocaleString('fr-FR')}
            </text>
          </g>
        ))}
        <text x={PLOT_LEFT - 8} y="9" className="exercise-progress-chart__unit-label">
          {series.unit}
        </text>

        {points.map((point, index) => (
          <line
            key={index}
            x1={point.x}
            y1={PLOT_BOTTOM}
            x2={point.x}
            y2={PLOT_BOTTOM + 4}
            className="exercise-progress-chart__axis"
          />
        ))}
        {points.map(
          (point, index) =>
            labelledIndexes.has(index) && (
              <text
                key={index}
                x={point.x}
                y={PLOT_BOTTOM + 16}
                textAnchor="middle"
                className="exercise-progress-chart__period-label"
              >
                {series.dateLabels[index]}
              </text>
            ),
        )}

        {hasTrend && <polyline points={polyline} className="exercise-progress-chart__line" />}
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
        <text
          x={last.x}
          y={last.y - 10}
          textAnchor={hasTrend ? 'end' : 'middle'}
          className="exercise-progress-chart__value-label--last"
        >
          {formatProgressValue(last.value, series.unit)}
        </text>
      </svg>
    </div>
  )
}

import type { TrendLineProps } from './trend-line.types'
import './trend-line.scss'

const WIDTH = 100
const HEIGHT = 32
const PADDING = 3

export const TrendLine = ({ values, label }: TrendLineProps) => {
  if (values.length < 2) {
    return null
  }

  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const points = values
    .map((value, index) => {
      const x = PADDING + (index / (values.length - 1)) * (WIDTH - PADDING * 2)
      const y = HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2)

      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg className="trend-line" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
      <title>{label}</title>
      <polyline className="trend-line__path" points={points} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

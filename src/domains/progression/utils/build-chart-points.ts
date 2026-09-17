const X_START = 20
const X_END = 300
const Y_TOP = 26
const Y_BOTTOM = 112

export type ChartPoint = { x: number; y: number; value: number }

export const buildChartPoints = (values: number[]): ChartPoint[] => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const xStep = values.length > 1 ? (X_END - X_START) / (values.length - 1) : 0

  return values.map((value, index) => ({
    x: X_START + xStep * index,
    y: Y_BOTTOM - ((value - min) / range) * (Y_BOTTOM - Y_TOP),
    value,
  }))
}

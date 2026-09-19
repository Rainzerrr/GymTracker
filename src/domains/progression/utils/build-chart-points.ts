export const CHART_WIDTH = 320
export const CHART_HEIGHT = 156
export const PLOT_LEFT = 46
export const PLOT_RIGHT = 306
export const PLOT_TOP = 20
export const PLOT_BOTTOM = 120

const POINT_INSET = 14
const TARGET_TICK_INTERVALS = 3

export type ChartPoint = { x: number; y: number; value: number }
export type ChartTick = { y: number; value: number }
export type ChartGeometry = { points: ChartPoint[]; ticks: ChartTick[] }

// Rounds a raw interval up to 1, 2, 2.5, 5 or 10 times a power of ten so the
// graduations land on readable values.
const getNiceStep = (rawStep: number): number => {
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const ratio = rawStep / magnitude
  const niceRatio = [1, 2, 2.5, 5, 10].find((candidate) => ratio <= candidate) ?? 10

  return niceRatio * magnitude
}

export const buildChartPoints = (values: number[]): ChartGeometry => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  // A flat series (or a lone session) still needs some vertical room around it.
  const range = max - min || Math.max(1, Math.abs(max) * 0.2)
  const step = getNiceStep(range / TARGET_TICK_INTERVALS)

  const domainMin = Math.max(0, Math.floor((min - (max === min ? range / 2 : 0)) / step) * step)
  const domainMax = Math.max(Math.ceil(max / step) * step, domainMin + step)
  const domainRange = domainMax - domainMin

  const toY = (value: number) =>
    PLOT_BOTTOM - ((value - domainMin) / domainRange) * (PLOT_BOTTOM - PLOT_TOP)

  const tickCount = Math.round(domainRange / step)
  const ticks = Array.from({ length: tickCount + 1 }, (_unused, index) => {
    const value = Math.round((domainMin + step * index) * 100) / 100

    return { value, y: toY(value) }
  })

  const xStart = PLOT_LEFT + POINT_INSET
  const xEnd = PLOT_RIGHT - POINT_INSET
  // A single session has no trend yet: park the lone point mid-chart.
  const xStep = values.length > 1 ? (xEnd - xStart) / (values.length - 1) : 0
  const xOrigin = values.length > 1 ? xStart : (xStart + xEnd) / 2

  const points = values.map((value, index) => ({
    x: xOrigin + xStep * index,
    y: toY(value),
    value,
  }))

  return { points, ticks }
}

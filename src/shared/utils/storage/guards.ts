export const isArray = <Item>(value: unknown): value is Item[] => Array.isArray(value)

export const isRecord = <Shape extends object>(value: unknown): value is Shape =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

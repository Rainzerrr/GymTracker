import type { PointerEvent } from 'react'

export type BuilderExerciseRowProps = {
  name: string
  thumbnailUrl: string
  targetLabel: string
  restLabel: string
  onTargetChange: (value: string) => void
  onRemove: () => void
  rowRef: (element: HTMLDivElement | null) => void
  onHandlePointerDown: (event: PointerEvent) => void
  isDragging: boolean
  dragOffset: number
}

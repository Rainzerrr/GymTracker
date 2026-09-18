import { useRef, useState } from 'react'

type UseReorderableListOptions<T> = {
  items: T[]
  getId: (item: T) => string
  onReorder: (nextItems: T[]) => void
}

export const useReorderableList = <T,>({ items, getId, onReorder }: UseReorderableListOptions<T>) => {
  const itemRefs = useRef(new Map<string, HTMLElement>())
  const dragState = useRef<{ id: string; order: T[]; lastY: number } | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  const registerItemRef = (id: string) => (element: HTMLElement | null) => {
    if (element) {
      itemRefs.current.set(id, element)
    } else {
      itemRefs.current.delete(id)
    }
  }

  const handlePointerDown = (id: string) => (event: React.PointerEvent) => {
    event.preventDefault()
    dragState.current = { id, order: items, lastY: event.clientY }
    setDraggingId(id)
    setDragOffset(0)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const drag = dragState.current
      if (!drag) {
        return
      }

      const deltaY = moveEvent.clientY - drag.lastY
      setDragOffset((current) => current + deltaY)
      drag.lastY = moveEvent.clientY

      const draggedElement = itemRefs.current.get(drag.id)
      if (!draggedElement) {
        return
      }

      const draggedRect = draggedElement.getBoundingClientRect()
      const draggedCenter = draggedRect.top + draggedRect.height / 2 + deltaY

      const currentIndex = drag.order.findIndex((item) => getId(item) === drag.id)
      let targetIndex = currentIndex

      drag.order.forEach((item, index) => {
        const itemId = getId(item)
        if (itemId === drag.id) {
          return
        }

        const element = itemRefs.current.get(itemId)
        if (!element) {
          return
        }

        const rect = element.getBoundingClientRect()
        const center = rect.top + rect.height / 2

        if (index < currentIndex && draggedCenter < center) {
          targetIndex = Math.min(targetIndex, index)
        }

        if (index > currentIndex && draggedCenter > center) {
          targetIndex = Math.max(targetIndex, index)
        }
      })

      if (targetIndex !== currentIndex) {
        const nextOrder = [...drag.order]
        const [moved] = nextOrder.splice(currentIndex, 1)
        nextOrder.splice(targetIndex, 0, moved)
        drag.order = nextOrder
        onReorder(nextOrder)
      }
    }

    const handlePointerUp = () => {
      dragState.current = null
      setDraggingId(null)
      setDragOffset(0)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return { draggingId, dragOffset, registerItemRef, handlePointerDown }
}

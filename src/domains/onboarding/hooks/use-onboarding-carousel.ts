import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { moveToStep } from '../utils/move-to-step'
import type { CarouselPosition } from '../utils/move-to-step'

const SWIPE_THRESHOLD_PX = 48

// Navigation entre les étapes : boutons, segments de progression, swipe et flèches du clavier.
export const useOnboardingCarousel = (stepCount: number) => {
  const [position, setPosition] = useState<CarouselPosition>({ index: 0, direction: 'forward' })
  const swipeStartX = useRef<number | null>(null)

  const goTo = (target: number) => setPosition((current) => moveToStep(current, target, stepCount))

  const next = () => goTo(position.index + 1)
  const previous = () => goTo(position.index - 1)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setPosition((current) => moveToStep(current, current.index + 1, stepCount))
      } else if (event.key === 'ArrowLeft') {
        setPosition((current) => moveToStep(current, current.index - 1, stepCount))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [stepCount])

  const swipeHandlers = {
    onPointerDown: (event: PointerEvent) => {
      swipeStartX.current = event.clientX
    },
    onPointerUp: (event: PointerEvent) => {
      const startX = swipeStartX.current
      swipeStartX.current = null

      if (startX === null) {
        return
      }

      const distance = event.clientX - startX

      if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) {
        goTo(position.index + (distance < 0 ? 1 : -1))
      }
    },
    onPointerCancel: () => {
      swipeStartX.current = null
    },
  }

  return {
    index: position.index,
    direction: position.direction,
    isFirst: position.index === 0,
    isLast: position.index === stepCount - 1,
    goTo,
    next,
    previous,
    swipeHandlers,
  }
}

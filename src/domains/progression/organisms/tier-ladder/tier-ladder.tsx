import { useEffect, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getSubLevelRoman } from '../../utils/get-sub-level-roman'
import type { TierLadderProps } from './tier-ladder.types'
import './tier-ladder.scss'

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const lockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8 10.5V7a4 4 0 018 0v3.5" strokeLinecap="round" />
  </svg>
)

const flameIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5c1.1 2.7-2.4 4.1-2.4 7.4a2.4 2.4 0 004.8 0c0-.9-.4-1.5-.6-2.4 1.9 1.3 3.2 3.6 3.2 5.9a5 5 0 01-10 0c0-4.6 3.6-6.9 5-10.9z" />
  </svg>
)

const REVEAL_DELAY_MS = 600
const SCROLL_UP_DURATION_MS = 900

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export const TierLadder = ({ steps }: TierLadderProps) => {
  const { t } = useTranslation('progression')
  const currentRef = useRef<HTMLLIElement>(null)

  useLayoutEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' })
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    const scroller = currentRef.current?.closest('[data-scroll-container]')

    if (!scroller) {
      return
    }

    let frame = 0

    // A fixed-length glide back to the top, regardless of how tall the
    // ladder is — the native smooth scroll stretches out on long pages.
    const animateScrollToTop = (startY: number, startTime: number) => (now: number) => {
      const progress = Math.min(1, (now - startTime) / SCROLL_UP_DURATION_MS)
      scroller.scrollTo(0, startY * (1 - easeInOutQuad(progress)))

      if (progress < 1) {
        frame = requestAnimationFrame(animateScrollToTop(startY, startTime))
      }
    }

    const timeout = window.setTimeout(() => {
      frame = requestAnimationFrame((now) => animateScrollToTop(scroller.scrollTop, now)(now))
    }, REVEAL_DELAY_MS)

    return () => {
      window.clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <ol className="tier-ladder">
      {steps.map((step) => (
        <li
          key={`${step.tier}-${step.subLevel}`}
          ref={step.status === 'current' ? currentRef : undefined}
          className={`tier-ladder__step tier-ladder__step--${step.status} tier-ladder__step--tier-${step.tier}`}
        >
          <span className={`tier-ladder__badge tier-ladder__badge--${step.tier}`}>
            {step.status === 'achieved' && checkIcon}
            {step.status === 'locked' && lockIcon}
            {step.status === 'current' && flameIcon}
          </span>
          <span className="tier-ladder__name">
            {t(`tiers.${step.tier}`)} {getSubLevelRoman(step.subLevel)}
          </span>
          <span className="tier-ladder__status">
            {t(`rank.detail.ladderStatus.${step.status}`)}
          </span>
        </li>
      ))}
    </ol>
  )
}

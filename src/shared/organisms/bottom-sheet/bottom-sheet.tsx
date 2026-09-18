import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { BottomSheetProps } from './bottom-sheet.types'
import './bottom-sheet.scss'

export const BottomSheet = ({ title, eyebrow, onClose, children }: BottomSheetProps) => {
  const { t } = useTranslation('common')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div className="bottom-sheet">
      <button
        type="button"
        className="bottom-sheet__backdrop"
        onClick={onClose}
        aria-label={t('actions.close')}
        tabIndex={-1}
      />
      <dialog className="bottom-sheet__panel" open aria-modal="true" aria-label={title}>
        <span className="bottom-sheet__handle" aria-hidden="true" />
        <header className="bottom-sheet__header">
          <div className="bottom-sheet__heading">
            {eyebrow && <span className="bottom-sheet__eyebrow">{eyebrow}</span>}
            <h2 className="bottom-sheet__title">{title}</h2>
          </div>
          <button
            type="button"
            className="bottom-sheet__close"
            onClick={onClose}
            aria-label={t('actions.close')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="bottom-sheet__body">{children}</div>
      </dialog>
    </div>,
    document.body,
  )
}

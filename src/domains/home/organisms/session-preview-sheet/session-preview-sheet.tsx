import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { BottomSheet } from '@shared/organisms/bottom-sheet'
import { formatRelativeDays } from '@shared/utils/date/format-relative-days'
import { formatLastSets, formatNextTarget } from '@domains/seance-active/utils/build-history-labels'
import type { SessionPreviewSheetProps } from './session-preview-sheet.types'
import './session-preview-sheet.scss'

export const SessionPreviewSheet = ({
  title,
  exercises,
  muscleGroups,
  durationMinutes,
  lastDoneAt,
  startLabel,
  onStart,
  onClose,
}: SessionPreviewSheetProps) => {
  const { t } = useTranslation('home')
  const { t: tActive } = useTranslation('seanceActive')
  const { t: tSessions } = useTranslation('seances')

  const summary = t('preview.summary', { duration: durationMinutes, count: exercises.length })
  const lastDoneLabel = lastDoneAt
    ? t('preview.lastDone', { when: formatRelativeDays(new Date(lastDoneAt)) })
    : t('preview.neverDone')
  const muscleLabels = muscleGroups.map((group) => tSessions(`muscleGroups.${group}`))

  return (
    <BottomSheet title={title} eyebrow={t('preview.eyebrow')} onClose={onClose}>
      <p className="session-preview-sheet__summary">{summary}</p>
      <p className="session-preview-sheet__muted">{lastDoneLabel}</p>
      {muscleLabels.length > 0 && (
        <ul className="session-preview-sheet__muscles">
          {muscleLabels.map((label) => (
            <li key={label} className="session-preview-sheet__muscle">
              {label}
            </li>
          ))}
        </ul>
      )}
      <ol className="session-preview-sheet__exercises">
        {exercises.map((exercise) => (
          <li key={exercise.id} className="session-preview-sheet__exercise">
            <Thumbnail src={exercise.thumbnailUrl} alt={exercise.name} />
            <div className="session-preview-sheet__text">
              <span className="session-preview-sheet__name">{exercise.name}</span>
              <span className="session-preview-sheet__muted">
                {exercise.targetLabel} · {exercise.restLabel}
              </span>
              {exercise.nextTarget && (
                <span className="session-preview-sheet__target">
                  {formatNextTarget(tActive, exercise.nextTarget, exercise.isBodyweight)}
                </span>
              )}
              {exercise.lastSets && (
                <span className="session-preview-sheet__muted">
                  {formatLastSets(tActive, exercise.lastSets)}
                </span>
              )}
              {!exercise.lastSets && (
                <span className="session-preview-sheet__muted">{t('preview.firstTime')}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      {startLabel && onStart && (
        <Button label={startLabel} variant="accent" fullWidth onClick={onStart} />
      )}
    </BottomSheet>
  )
}

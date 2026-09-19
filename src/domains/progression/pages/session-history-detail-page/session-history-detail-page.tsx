import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { SectionLabel } from '@shared/atoms/section-label'
import { BackHeader } from '@shared/molecules/back-header'
import { PhotoHero } from '@shared/organisms/photo-hero'
import { PageTemplate } from '@shared/templates/page-template'
import { formatDateLabel } from '@shared/utils/date/format-date-label'
import { HistoryExerciseCard } from '../../organisms/history-exercise-card'
import { computeSessionXp } from '../../utils/compute-session-xp'
import './session-history-detail-page.scss'

export const SessionHistoryDetailPage = () => {
  const { entryId } = useParams<{ entryId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('progression')
  const { sessionLog } = useSessionLog()

  const entry = sessionLog.find((candidate) => candidate.id === entryId)

  useEffect(() => {
    if (!entry) {
      navigate('/progression', { replace: true })
    }
  }, [entry, navigate])

  if (!entry) {
    return null
  }

  const performedExercises = entry.exercises
    .map((exercise) => ({ ...exercise, sets: exercise.sets.filter((set) => set.reps > 0) }))
    .filter((exercise) => exercise.sets.length > 0)

  return (
    <PageTemplate header={<BackHeader title={t('sessionDetail.headerTitle')} onBack={() => navigate('/progression')} />}>
      <div className="session-history-detail-page__hero">
        <PhotoHero
          imageUrl={entry.imageUrl}
          alt={entry.sessionName}
          title={entry.sessionName}
          meta={t('sessionDetail.meta', {
            date: formatDateLabel(entry.completedAt),
            duration: entry.durationMinutes,
          })}
          heightRem={11.5}
          topRight={
            <span className="session-history-detail-page__xp">
              {t('sessionDetail.xp', { amount: computeSessionXp(entry.exercises) })}
            </span>
          }
        />
      </div>

      <SectionLabel label={t('sessionDetail.exercisesLabel')} />
      {performedExercises.length === 0 ? (
        <p className="session-history-detail-page__empty">{t('sessionDetail.empty')}</p>
      ) : (
        <div className="session-history-detail-page__list">
          {performedExercises.map((exercise) => (
            <HistoryExerciseCard
              key={exercise.libraryExerciseId}
              name={exercise.name}
              thumbnailUrl={exercise.thumbnailUrl}
              sets={exercise.sets}
            />
          ))}
        </div>
      )}
    </PageTemplate>
  )
}

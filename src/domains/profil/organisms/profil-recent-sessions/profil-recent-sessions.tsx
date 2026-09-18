import { useTranslation } from 'react-i18next'
import { SectionLabel } from '@shared/atoms/section-label'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { ListRow } from '@shared/molecules/list-row'
import { formatShortDateLabel } from '@shared/utils/date/format-date-label'
import type { ProfilRecentSessionsProps } from './profil-recent-sessions.types'
import './profil-recent-sessions.scss'

export const ProfilRecentSessions = ({ entries }: ProfilRecentSessionsProps) => {
  const { t } = useTranslation('profil')

  return (
    <section>
      <SectionLabel label={t('recentSessions.label')} />
      {entries.length === 0 ? (
        <p className="profil-recent-sessions__empty">{t('recentSessions.empty')}</p>
      ) : (
        <div>
          {entries.map((entry) => {
            const totalSets = entry.exercises.reduce(
              (total, exercise) => total + exercise.sets.filter((set) => set.reps > 0).length,
              0,
            )

            return (
              <ListRow
                key={entry.id}
                leading={<Thumbnail src={entry.imageUrl} alt={entry.sessionName} />}
                title={entry.sessionName}
                subtitle={formatShortDateLabel(entry.completedAt)}
                trailing={
                  <span className="profil-recent-sessions__meta">
                    {totalSets > 0
                      ? t('recentSessions.meta', { duration: entry.durationMinutes, count: totalSets })
                      : t('recentSessions.noSets')}
                  </span>
                }
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

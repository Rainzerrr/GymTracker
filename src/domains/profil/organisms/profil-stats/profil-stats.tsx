import { useTranslation } from 'react-i18next'
import { SectionLabel } from '@shared/atoms/section-label'
import type { ProfilStatsProps } from './profil-stats.types'
import './profil-stats.scss'

export const ProfilStats = ({
  sessionsCompletedCount,
  trainingDurationLabel,
  totalSets,
  currentStreakSessions,
}: ProfilStatsProps) => {
  const { t } = useTranslation('profil')

  const stats = [
    { value: sessionsCompletedCount, label: t('stats.sessions') },
    { value: trainingDurationLabel, label: t('stats.duration') },
    { value: totalSets, label: t('stats.sets') },
    { value: t('stats.streakValue', { count: currentStreakSessions }), label: t('stats.streak') },
  ]

  return (
    <section>
      <SectionLabel label={t('stats.label')} />
      <div className="profil-stats">
        {stats.map((stat) => (
          <div className="profil-stats__card" key={stat.label}>
            <span className="profil-stats__value">{stat.value}</span>
            <span className="profil-stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

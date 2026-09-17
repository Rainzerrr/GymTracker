import { useTranslation } from 'react-i18next'
import { SectionLabel } from '@shared/atoms/section-label'
import { MuscleBar } from '../../atoms/muscle-bar'
import type { ProfilMuscleSplitProps } from './profil-muscle-split.types'
import './profil-muscle-split.scss'

export const ProfilMuscleSplit = ({ items }: ProfilMuscleSplitProps) => {
  const { t } = useTranslation('profil')
  const { t: tSeances } = useTranslation('seances')

  return (
    <section>
      <SectionLabel label={t('muscleSplit.label')} />
      {items.length === 0 ? (
        <p className="profil-muscle-split__empty">{t('muscleSplit.empty')}</p>
      ) : (
        <div className="profil-muscle-split">
          {items.map((item) => (
            <MuscleBar
              key={item.muscleGroup}
              label={tSeances(`muscleGroups.${item.muscleGroup}`)}
              meta={t('muscleSplit.setsCount', { count: item.sets })}
              percent={item.percent}
            />
          ))}
        </div>
      )}
    </section>
  )
}

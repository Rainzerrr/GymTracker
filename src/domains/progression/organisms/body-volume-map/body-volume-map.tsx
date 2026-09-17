import { useTranslation } from 'react-i18next'
import { ListRow } from '@shared/molecules/list-row'
import { StatusDot } from '../../atoms/status-dot'
import { SegmentedToggle } from '../../molecules/segmented-toggle'
import { BodyFigure } from './body-figure'
import type { BodyVolumeMapProps } from './body-volume-map.types'
import './body-volume-map.scss'

export const BodyVolumeMap = ({ bodyView, onBodyViewChange, muscles }: BodyVolumeMapProps) => {
  const { t } = useTranslation('progression')
  const statusByMuscle = Object.fromEntries(
    muscles.map((muscle) => [muscle.muscleGroup, muscle.status]),
  )

  return (
    <div className="body-volume-map">
      <p className="body-volume-map__subtitle">{t('volume.subtitle')}</p>

      <SegmentedToggle
        value={bodyView}
        onChange={(value) => onBodyViewChange(value as BodyVolumeMapProps['bodyView'])}
        options={[
          { value: 'front', label: t('volume.toggle.front') },
          { value: 'back', label: t('volume.toggle.back') },
        ]}
      />

      <div className="body-volume-map__illustration">
        <BodyFigure view={bodyView} statusByMuscle={statusByMuscle} />
      </div>

      <div className="body-volume-map__legend">
        <span className="body-volume-map__legend-item">
          <StatusDot status="none" />
          {t('volume.legend.none')}
        </span>
        <span className="body-volume-map__legend-item">
          <StatusDot status="under" />
          {t('volume.legend.under')}
        </span>
        <span className="body-volume-map__legend-item">
          <StatusDot status="target" />
          {t('volume.legend.target')}
        </span>
      </div>

      <div>
        {muscles.map((muscle) => (
          <ListRow
            key={muscle.muscleGroup}
            title={muscle.label}
            trailing={<StatusDot status={muscle.status} />}
          />
        ))}
      </div>
    </div>
  )
}

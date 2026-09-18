import { useTranslation } from 'react-i18next'
import { ChevronIcon } from '@shared/atoms/chevron-icon'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'
import { StatusDot } from '../../atoms/status-dot'
import { SegmentedToggle } from '../../molecules/segmented-toggle'
import { formatSets } from '../../utils/format-sets'
import { BodyFigure } from './body-figure'
import type { BodyVolumeMapProps } from './body-volume-map.types'
import './body-volume-map.scss'

export const BodyVolumeMap = ({
  bodyView,
  onBodyViewChange,
  regions,
  selectedMuscle,
  onSelectMuscle,
}: BodyVolumeMapProps) => {
  const { t } = useTranslation('progression')
  const statusByMuscle = Object.fromEntries(
    regions.flatMap(({ muscles }) => muscles.map((muscle) => [muscle.muscle, muscle.status])),
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
        <BodyFigure
          view={bodyView}
          statusByMuscle={statusByMuscle}
          selectedMuscle={selectedMuscle}
          onSelectMuscle={onSelectMuscle}
        />
      </div>

      <div className="body-volume-map__legend">
        <span>{t('volume.legend.none')}</span>
        <span className="body-volume-map__legend-scale">
          <StatusDot status="none" />
          <StatusDot status="low" />
          <StatusDot status="medium" />
          <StatusDot status="high" />
          <StatusDot status="target" />
        </span>
        <span>{t('volume.legend.target')}</span>
      </div>

      <div>
        {regions.map((region) => (
          <div key={region.label}>
            <SectionLabel label={region.label} />
            {region.muscles.map((muscle) => (
              <ListRow
                key={muscle.muscle}
                title={muscle.label}
                subtitle={t('volume.listSets', {
                  sets: formatSets(muscle.effectiveSets),
                  target: muscle.targetSets,
                })}
                trailing={
                  <span className="body-volume-map__row-trailing">
                    <StatusDot status={muscle.status} />
                    <ChevronIcon />
                  </span>
                }
                onClick={() => onSelectMuscle(muscle.muscle)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

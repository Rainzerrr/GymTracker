import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'
import { Stepper } from '@shared/molecules/stepper'
import { MUSCLE_REGIONS } from '@domains/progression/data/muscle-config'
import type { Muscle } from '@domains/seances/types/muscle'
import './settings-volume-targets.scss'

const MUSCLES = MUSCLE_REGIONS.flatMap(({ muscles }) => muscles)
const MIN_TARGET_SETS = 1
const MAX_TARGET_SETS = 40

type SettingsVolumeTargetsProps = {
  targets: Record<Muscle, number>
  hasCustomTargets: boolean
  onTargetChange: (muscle: Muscle, sets: number) => void
  onReset: () => void
}

export const SettingsVolumeTargets = ({
  targets,
  hasCustomTargets,
  onTargetChange,
  onReset,
}: SettingsVolumeTargetsProps) => {
  const { t } = useTranslation('reglages')
  const { t: tProgression } = useTranslation('progression')

  return (
    <section>
      <SectionLabel label={t('volume.label')} />
      <p className="settings-volume-targets__hint">{t('volume.hint')}</p>
      {MUSCLES.map((muscle) => (
        <ListRow
          key={muscle}
          title={tProgression(`volume.muscles.${muscle}`)}
          trailing={
            <Stepper
              value={targets[muscle]}
              min={MIN_TARGET_SETS}
              max={MAX_TARGET_SETS}
              onChange={(sets) => onTargetChange(muscle, sets)}
            />
          }
        />
      ))}
      {hasCustomTargets && (
        <Button label={t('volume.reset')} variant="outline" fullWidth onClick={onReset} />
      )}
    </section>
  )
}

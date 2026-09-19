import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { Muscle } from '@domains/seances/types/muscle'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { MUSCLE_REGIONS } from '../../data/muscle-config'
import { useVolumeDistribution } from '../../hooks/use-volume-distribution'
import { BodyVolumeMap } from '../../organisms/body-volume-map'
import type { BodyView } from '../../organisms/body-volume-map'
import { MuscleDetailSheet } from '../../organisms/muscle-detail-sheet'

export const VolumePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('progression')
  const { muscleVolumes } = useVolumeDistribution()
  const [bodyView, setBodyView] = useState<BodyView>('front')
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null)

  const getLabel = (muscle: Muscle) => t(`volume.muscles.${muscle}`)

  const regions = MUSCLE_REGIONS.map(({ region, muscles }) => ({
    label: t(`volume.regions.${region}`),
    muscles: muscles.flatMap((muscle) => {
      const volume = muscleVolumes.find((entry) => entry.muscle === muscle)
      return volume ? [{ ...volume, label: getLabel(muscle) }] : []
    }),
  }))

  const selectedVolume = muscleVolumes.find((entry) => entry.muscle === selectedMuscle)

  return (
    <PageTemplate header={<BackHeader title={t('volume.headerTitle')} onBack={() => navigate('/')} />}>
      <BodyVolumeMap
        bodyView={bodyView}
        onBodyViewChange={setBodyView}
        regions={regions}
        selectedMuscle={selectedMuscle}
        onSelectMuscle={setSelectedMuscle}
      />
      {selectedVolume && selectedMuscle && (
        <MuscleDetailSheet
          volume={selectedVolume}
          label={getLabel(selectedMuscle)}
          onClose={() => setSelectedMuscle(null)}
        />
      )}
    </PageTemplate>
  )
}

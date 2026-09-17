import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { useVolumeDistribution } from '../../hooks/use-volume-distribution'
import { BodyVolumeMap } from '../../organisms/body-volume-map'
import type { BodyView } from '../../organisms/body-volume-map'

export const VolumePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('progression')
  const { t: tSeances } = useTranslation('seances')
  const { muscleVolumes } = useVolumeDistribution()
  const [bodyView, setBodyView] = useState<BodyView>('front')

  const muscles = muscleVolumes.map((muscle) => ({
    muscleGroup: muscle.muscleGroup,
    label: tSeances(`muscleGroups.${muscle.muscleGroup}`),
    status: muscle.status,
  }))

  return (
    <PageTemplate>
      <BackHeader title={t('volume.headerTitle')} onBack={() => navigate('/')} />
      <BodyVolumeMap bodyView={bodyView} onBodyViewChange={setBodyView} muscles={muscles} />
    </PageTemplate>
  )
}

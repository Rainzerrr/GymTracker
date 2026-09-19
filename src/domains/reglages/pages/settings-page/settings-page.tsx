import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { usePostureRoutine } from '@domains/home/hooks/use-posture-routine'
import { useVolumeTargets } from '@domains/progression/hooks/use-volume-targets'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { toLocalDateKey } from '@shared/utils/date/to-local-date-key'
import { useAppSettings } from '../../hooks/use-app-settings'
import { SettingsAppearance } from '../../organisms/settings-appearance'
import { SettingsPosture } from '../../organisms/settings-posture'
import { SettingsSession } from '../../organisms/settings-session'
import { SettingsVolumeTargets } from '../../organisms/settings-volume-targets'

export const SettingsPage = () => {
  const { t } = useTranslation('reglages')
  const navigate = useNavigate()
  const { settings, updateSettings } = useAppSettings()
  const volume = useVolumeTargets()
  const posture = usePostureRoutine(toLocalDateKey(new Date()))

  return (
    <PageTemplate header={<BackHeader title={t('title')} onBack={() => navigate('/profil')} />}>
      <SettingsAppearance
        theme={settings.theme}
        onThemeChange={(theme) => updateSettings({ theme })}
      />
      <SettingsSession settings={settings} onChange={updateSettings} />
      <SettingsPosture
        isEnabled={settings.postureRoutineEnabled}
        steps={posture.steps}
        onEnabledChange={(postureRoutineEnabled) => updateSettings({ postureRoutineEnabled })}
        onStepsChange={posture.setSteps}
        onResetSteps={posture.resetSteps}
      />
      <SettingsVolumeTargets
        targets={volume.targets}
        hasCustomTargets={volume.hasCustomTargets}
        onTargetChange={volume.setTarget}
        onReset={volume.resetTargets}
      />
    </PageTemplate>
  )
}

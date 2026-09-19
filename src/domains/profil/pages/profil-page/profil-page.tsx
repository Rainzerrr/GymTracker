import { useNavigate } from 'react-router-dom'
import { PageTemplate } from '@shared/templates/page-template'
import { useDataBackup } from '@shared/hooks/use-data-backup'
import { useResetAllData } from '@shared/hooks/use-reset-all-data'
import { formatDateLabel } from '@shared/utils/date/format-date-label'
import { useBodyWeight } from '../../hooks/use-body-weight'
import { useProfilIdentity } from '../../hooks/use-profil-identity'
import { useProfilOverview } from '../../hooks/use-profil-overview'
import { ProfilBackup } from '../../organisms/profil-backup'
import { ProfilBodyWeight } from '../../organisms/profil-body-weight'
import { ProfilHeader } from '../../organisms/profil-header'
import { ProfilMuscleSplit } from '../../organisms/profil-muscle-split'
import { ProfilOnboarding } from '../../organisms/profil-onboarding'
import { ProfilRecentSessions } from '../../organisms/profil-recent-sessions'
import { ProfilResetData } from '../../organisms/profil-reset-data'
import { ProfilShortcuts } from '../../organisms/profil-shortcuts'
import { ProfilStats } from '../../organisms/profil-stats'
import { formatTrainingDuration } from '../../utils/format-training-duration'

export const ProfilPage = () => {
  const navigate = useNavigate()
  const { resetAllData } = useResetAllData()
  const { importState, exportData, readFile, cancelImport, confirmImport } = useDataBackup()
  const { storedBodyWeightKg, setBodyWeightKg, history, recordBodyWeight, removeEntry } =
    useBodyWeight()
  const { displayName, setDisplayName, memberSinceIso } = useProfilIdentity()
  const {
    sessionsCompletedCount,
    totalMinutesTrained,
    totalSets,
    currentStreakSessions,
    muscleSplit,
    recentEntries,
  } = useProfilOverview()

  return (
    <PageTemplate
      header={
        <ProfilHeader
          displayName={displayName}
          memberSinceLabel={formatDateLabel(memberSinceIso)}
          onSaveName={setDisplayName}
        />
      }
    >
      <ProfilStats
        sessionsCompletedCount={sessionsCompletedCount}
        trainingDurationLabel={formatTrainingDuration(totalMinutesTrained)}
        totalSets={totalSets}
        currentStreakSessions={currentStreakSessions}
      />
      <ProfilBodyWeight
        bodyWeightKg={storedBodyWeightKg}
        onChange={setBodyWeightKg}
        history={history}
        onRecord={recordBodyWeight}
        onRemoveEntry={removeEntry}
      />
      <ProfilMuscleSplit items={muscleSplit} />
      <ProfilRecentSessions entries={recentEntries} />
      <ProfilShortcuts
        onSessionsClick={() => navigate('/seances')}
        onPlanningClick={() => navigate('/seances/planning')}
        onProgressionClick={() => navigate('/progression')}
        onSettingsClick={() => navigate('/profil/reglages')}
      />
      <ProfilOnboarding onOpen={() => navigate('/onboarding')} />
      <ProfilBackup
        importState={importState}
        onExport={exportData}
        onFileSelected={readFile}
        onCancelImport={cancelImport}
        onConfirmImport={confirmImport}
      />
      <ProfilResetData onReset={resetAllData} />
    </PageTemplate>
  )
}

import { useNavigate } from 'react-router-dom'
import { PageTemplate } from '@shared/templates/page-template'
import { useResetAllData } from '@shared/hooks/use-reset-all-data'
import { formatDateLabel } from '@shared/utils/date/format-date-label'
import { useProfilIdentity } from '../../hooks/use-profil-identity'
import { useProfilOverview } from '../../hooks/use-profil-overview'
import { ProfilHeader } from '../../organisms/profil-header'
import { ProfilMuscleSplit } from '../../organisms/profil-muscle-split'
import { ProfilRecentSessions } from '../../organisms/profil-recent-sessions'
import { ProfilResetData } from '../../organisms/profil-reset-data'
import { ProfilShortcuts } from '../../organisms/profil-shortcuts'
import { ProfilStats } from '../../organisms/profil-stats'
import { formatTrainingDuration } from '../../utils/format-training-duration'

export const ProfilPage = () => {
  const navigate = useNavigate()
  const { resetAllData } = useResetAllData()
  const { displayName, setDisplayName, memberSinceIso } = useProfilIdentity()
  const {
    sessionsCompletedCount,
    totalMinutesTrained,
    totalSets,
    currentStreakDays,
    muscleSplit,
    recentEntries,
  } = useProfilOverview()

  return (
    <PageTemplate>
      <ProfilHeader
        displayName={displayName}
        memberSinceLabel={formatDateLabel(memberSinceIso)}
        onSaveName={setDisplayName}
      />
      <ProfilStats
        sessionsCompletedCount={sessionsCompletedCount}
        trainingDurationLabel={formatTrainingDuration(totalMinutesTrained)}
        totalSets={totalSets}
        currentStreakDays={currentStreakDays}
      />
      <ProfilMuscleSplit items={muscleSplit} />
      <ProfilRecentSessions entries={recentEntries} />
      <ProfilShortcuts
        onSessionsClick={() => navigate('/seances')}
        onPlanningClick={() => navigate('/seances/planning')}
        onProgressionClick={() => navigate('/progression')}
      />
      <ProfilResetData onReset={resetAllData} />
    </PageTemplate>
  )
}

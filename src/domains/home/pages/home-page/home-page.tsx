import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { usePlayerLevel } from '@domains/progression/hooks/use-player-level'
import { Button } from '@shared/atoms/button'
import { useHomeOverview } from '../../hooks/use-home-overview'
import { NextWorkoutCard } from '../../organisms/next-workout-card'
import { PlayerLevelBar } from '../../organisms/player-level-bar'
import { ProgressSection } from '../../organisms/progress-section'
import { RestDayBanner } from '../../organisms/rest-day-banner'
import { TodaySection } from '../../organisms/today-section'
import { WeekStrip } from '../../organisms/week-strip'
import './home-page.scss'

export const HomePage = () => {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const {
    selectedDayLabel,
    selectedDayDateIso,
    selectedDayStatus,
    isSelectedDayToday,
    selectedDayIndex,
    selectDay,
    isRestDay,
    selectedSessionId,
    selectedSession,
    streak,
    volumeSummary,
    lastExercise,
    weekDays,
    postureValidated,
    validatePosture,
  } = useHomeOverview()
  const { level, levelTitle, currentXp, xpToNextLevel } = usePlayerLevel()

  const canStartSelectedSession = isSelectedDayToday && selectedDayStatus === 'scheduled'
  const canViewSelectedSession = selectedDayStatus === 'done' || selectedDayStatus === 'missed'

  const handlePrimaryAction = () => {
    if (!selectedSessionId) {
      return
    }

    navigate(
      canStartSelectedSession
        ? `/seance-active/${selectedSessionId}`
        : `/seance-log/${selectedSessionId}?date=${encodeURIComponent(selectedDayDateIso)}`,
    )
  }

  return (
    <div className="home-page">
      {isRestDay || !selectedSession ? (
        <RestDayBanner dateLabel={selectedDayLabel} />
      ) : (
        <NextWorkoutCard
          title={selectedSession.title}
          durationMinutes={selectedSession.durationMinutes}
          exerciseCount={selectedSession.exerciseCount}
          imageUrl={selectedSession.imageUrl}
          dateLabel={selectedDayLabel}
          streakCount={streak.current}
          status={selectedDayStatus}
        />
      )}
      <div className="home-page__content">
        <PlayerLevelBar
          level={level}
          levelTitle={levelTitle}
          currentXp={currentXp}
          xpToNextLevel={xpToNextLevel}
        />
        {(canStartSelectedSession || canViewSelectedSession) && (
          <Button
            label={canStartSelectedSession ? t('cta') : t('viewSessionCta')}
            variant="accent"
            fullWidth
            onClick={handlePrimaryAction}
          />
        )}
        <WeekStrip days={weekDays} selectedIndex={selectedDayIndex} onSelectDay={selectDay} />
        <TodaySection
          streakCurrent={streak.current}
          streakTrend={streak.trend}
          postureValidated={postureValidated}
          onValidatePosture={validatePosture}
        />
        <ProgressSection
          musclesUnderTarget={volumeSummary.musclesUnderTarget}
          lastExercise={lastExercise}
          onVolumeClick={() => navigate('/progression/volume')}
          onLastExerciseClick={() => navigate('/progression/rangs')}
        />
      </div>
    </div>
  )
}

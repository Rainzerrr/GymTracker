import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { HOME_CTA_HEIGHT_REM } from '../../constants/home-hero'
import { useHomeOverview } from '../../hooks/use-home-overview'
import { useStarterProgram } from '@domains/seances/hooks/use-starter-program'
import { NextWorkoutCard } from '../../organisms/next-workout-card'
import { ProgressSection } from '../../organisms/progress-section'
import { RestDayBanner } from '../../organisms/rest-day-banner'
import { WelcomeBanner } from '../../organisms/welcome-banner'
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
    hasResumableSession,
    selectedSessionId,
    selectedSession,
    streak,
    volumeSummary,
    lastExercise,
    weekDays,
    posture,
    hasNoSessions,
  } = useHomeOverview()
  const { installStarterProgram } = useStarterProgram()

  const canStartSelectedSession = isSelectedDayToday && selectedDayStatus === 'scheduled'
  const canViewSelectedSession = selectedDayStatus === 'done' || selectedDayStatus === 'missed'
  const showsRestBanner = isRestDay || !selectedSession
  const startLabel = hasResumableSession ? t('resumeCta') : t('cta')

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
      {hasNoSessions ? (
        <WelcomeBanner
          onInstallStarter={installStarterProgram}
          onCreateSession={() => navigate('/seances/nouvelle')}
        />
      ) : showsRestBanner ? (
        <RestDayBanner dateLabel={selectedDayLabel} hasPostureRoutine={posture.isEnabled} />
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
        {!showsRestBanner && !hasNoSessions && (
          <div className="home-page__cta" style={{ height: `${HOME_CTA_HEIGHT_REM}rem` }}>
            {(canStartSelectedSession || canViewSelectedSession) && (
              <Button
                label={canStartSelectedSession ? startLabel : t('viewSessionCta')}
                variant="accent"
                fullWidth
                onClick={handlePrimaryAction}
              />
            )}
          </div>
        )}
        <WeekStrip days={weekDays} selectedIndex={selectedDayIndex} onSelectDay={selectDay} />
        <TodaySection
          streakCurrent={streak.current}
          streakTrend={streak.trend}
          postureEnabled={posture.isEnabled}
          postureSteps={posture.steps}
          postureValidated={posture.isValidatedToday}
          onValidatePosture={posture.validateToday}
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

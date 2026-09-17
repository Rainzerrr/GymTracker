import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { useHomeOverview } from '../../hooks/use-home-overview'
import { NextWorkoutCard } from '../../organisms/next-workout-card'
import { ProgressSection } from '../../organisms/progress-section'
import { RestDayBanner } from '../../organisms/rest-day-banner'
import { TodaySection } from '../../organisms/today-section'
import { WeekStrip } from '../../organisms/week-strip'
import './home-page.scss'

export const HomePage = () => {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const {
    todayLabel,
    isRestDay,
    todaySessionId,
    todaySession,
    streak,
    volumeSummary,
    lastExercise,
    weekDays,
    postureValidated,
    validatePosture,
  } = useHomeOverview()

  const handleStartClick = () => navigate(`/seance-active/${todaySessionId}`)

  return (
    <div className="home-page">
      {isRestDay || !todaySession ? (
        <RestDayBanner dateLabel={todayLabel} />
      ) : (
        <NextWorkoutCard
          title={todaySession.title}
          durationMinutes={todaySession.durationMinutes}
          exerciseCount={todaySession.exerciseCount}
          imageUrl={todaySession.imageUrl}
          dateLabel={todayLabel}
          streakCount={streak.current}
        />
      )}
      <div className="home-page__content">
        {!isRestDay && todaySession && (
          <Button label={t('cta')} variant="accent" fullWidth onClick={handleStartClick} />
        )}
        <WeekStrip days={weekDays} />
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

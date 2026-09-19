import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { getWeekdayNames } from '@shared/utils/date/get-weekday-names'
import { useSessions } from '../../hooks/use-sessions'
import { useWeekPlan } from '../../hooks/use-week-plan'
import { WeekPlanList } from '../../organisms/week-plan-list'
import type { DayAssignmentValue } from '../../types/day-assignment'

export const WeekPlanPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('seances')
  const { sessions } = useSessions()
  const { weekPlan, setAssignment } = useWeekPlan()

  const weekdayNames = getWeekdayNames()
  const cycleOptions: DayAssignmentValue[] = ['rest', 'free', ...sessions.map((session) => session.id)]

  const resolveLabel = (value: DayAssignmentValue) => {
    if (value === 'rest') return t('weekPlan.restTotal')
    if (value === 'free') return t('weekPlan.free')

    return sessions.find((session) => session.id === value)?.name ?? t('weekPlan.free')
  }

  const days = weekdayNames.map((dayName, index) => {
    const value = weekPlan[index] ?? 'free'
    const isRestLike = value === 'rest' || value === 'free'
    const session = isRestLike ? undefined : sessions.find((item) => item.id === value)

    return {
      dayIndex: index,
      dayName,
      currentLabel: resolveLabel(value),
      isRestLike,
      thumbnailUrl: session?.imageUrl,
    }
  })

  const handleCycle = (dayIndex: number) => {
    const current = weekPlan[dayIndex] ?? 'free'
    const currentPosition = cycleOptions.indexOf(current)
    const next = cycleOptions[(currentPosition + 1) % cycleOptions.length]
    setAssignment(dayIndex, next)
  }

  return (
    <PageTemplate header={<BackHeader title={t('weekPlan.headerTitle')} onBack={() => navigate('/seances')} />}>
      <WeekPlanList days={days} onCycle={handleCycle} onSave={() => navigate('/seances')} />
    </PageTemplate>
  )
}

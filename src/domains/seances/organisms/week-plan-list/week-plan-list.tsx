import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { ListRow } from '@shared/molecules/list-row'
import type { WeekPlanListProps } from './week-plan-list.types'
import './week-plan-list.scss'

export const WeekPlanList = ({ days, onCycle, onSave }: WeekPlanListProps) => {
  const { t } = useTranslation('seances')

  return (
    <div className="week-plan-list">
      <p className="week-plan-list__hint">{t('weekPlan.hint')}</p>

      <div>
        {days.map((day) => (
          <ListRow
            key={day.dayIndex}
            leading={
              day.isRestLike || !day.thumbnailUrl ? (
                <span className="week-plan-list__placeholder" />
              ) : (
                <Thumbnail src={day.thumbnailUrl} alt={day.currentLabel} />
              )
            }
            title={`${day.dayName} · ${day.currentLabel}`}
            subtitle={day.isRestLike ? t('weekPlan.tapToAssign') : t('weekPlan.tapToChange')}
            trailing={
              <svg
                className="week-plan-list__cycle-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
              </svg>
            }
            onClick={() => onCycle(day.dayIndex)}
          />
        ))}
      </div>

      <div className="week-plan-list__save">
        <Button label={t('weekPlan.save')} variant="accent" fullWidth onClick={onSave} />
      </div>
    </div>
  )
}

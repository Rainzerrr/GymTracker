import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'
import { MiniDots } from '../../molecules/mini-dots'
import { PostureRoutineSheet } from '../posture-routine-sheet'
import type { TodaySectionProps } from './today-section.types'
import './today-section.scss'

export const TodaySection = ({
  streakCurrent,
  streakTrend,
  postureEnabled,
  postureSteps,
  postureValidated,
  onValidatePosture,
}: TodaySectionProps) => {
  const { t } = useTranslation('home')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const steps = postureSteps.filter((step) => step.trim() !== '')
  const postureSubtitle = postureValidated
    ? t('todaySection.postureValidated')
    : t('todaySection.postureNotValidated')

  return (
    <section>
      <SectionLabel label={t('todaySection.label')} />
      <ListRow
        title={t('todaySection.streakTitle')}
        subtitle={t('todaySection.streakSubtitle')}
        meta={<MiniDots values={streakTrend} />}
        trailing={<span className="today-section__streak-count">{streakCurrent}</span>}
      />
      {postureEnabled && (
        <ListRow
          title={t('todaySection.postureTitle')}
          subtitle={postureSubtitle}
          meta={
            steps.length > 0 && (
              <button
                type="button"
                className="today-section__steps-link"
                onClick={() => setIsSheetOpen(true)}
              >
                {t('todaySection.viewSteps', { count: steps.length })}
              </button>
            )
          }
          trailing={
            !postureValidated && (
              <Button
                label={t('todaySection.validate')}
                variant="outline"
                onClick={onValidatePosture}
              />
            )
          }
        />
      )}
      {isSheetOpen && (
        <PostureRoutineSheet
          steps={steps}
          isValidated={postureValidated}
          onValidate={onValidatePosture}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </section>
  )
}

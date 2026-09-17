import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'
import { MiniDots } from '../../molecules/mini-dots'
import type { TodaySectionProps } from './today-section.types'
import './today-section.scss'

export const TodaySection = ({
  streakCurrent,
  streakTrend,
  postureValidated,
  onValidatePosture,
}: TodaySectionProps) => {
  const { t } = useTranslation('home')
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
      <ListRow
        title={t('todaySection.postureTitle')}
        subtitle={postureSubtitle}
        trailing={
          !postureValidated && (
            <Button label={t('todaySection.validate')} variant="outline" onClick={onValidatePosture} />
          )
        }
      />
    </section>
  )
}

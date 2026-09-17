import { useTranslation } from 'react-i18next'
import { ChevronIcon } from '@shared/atoms/chevron-icon'
import { IconChip } from '@shared/atoms/icon-chip'
import { SectionLabel } from '@shared/atoms/section-label'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { ListRow } from '@shared/molecules/list-row'
import type { ProgressSectionProps } from './progress-section.types'

const bodyIcon = (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="8" r="4.5" fill="currentColor" />
    <g stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="24" y1="13" x2="24" y2="28" />
      <path d="M24 17 L14 24" />
      <path d="M24 17 L34 24" />
      <path d="M24 28 L18 42" />
      <path d="M24 28 L30 42" />
    </g>
  </svg>
)

export const ProgressSection = ({
  musclesUnderTarget,
  lastExerciseName,
  lastExerciseRankLabel,
  lastExerciseThumbnailUrl,
}: ProgressSectionProps) => {
  const { t } = useTranslation('home')
  const volumeSubtitle = t('progressSection.volumeSubtitle', { count: musclesUnderTarget })

  return (
    <section>
      <SectionLabel label={t('progressSection.label')} />
      <ListRow
        leading={<IconChip icon={bodyIcon} />}
        title={t('progressSection.volumeTitle')}
        subtitle={volumeSubtitle}
        trailing={<ChevronIcon />}
      />
      <ListRow
        leading={<Thumbnail src={lastExerciseThumbnailUrl} alt={lastExerciseName} />}
        title={lastExerciseName}
        subtitle={lastExerciseRankLabel}
        trailing={<ChevronIcon />}
      />
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { ChevronIcon } from '@shared/atoms/chevron-icon'
import { IconChip } from '@shared/atoms/icon-chip'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'

const sparkleIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path
      d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
      strokeLinejoin="round"
    />
    <path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15z" strokeLinejoin="round" />
  </svg>
)

type ProfilOnboardingProps = {
  onOpen: () => void
}

export const ProfilOnboarding = ({ onOpen }: ProfilOnboardingProps) => {
  const { t } = useTranslation('profil')

  return (
    <section>
      <SectionLabel label={t('onboarding.label')} />
      <ListRow
        leading={<IconChip icon={sparkleIcon} />}
        title={t('onboarding.title')}
        subtitle={t('onboarding.subtitle')}
        trailing={<ChevronIcon />}
        onClick={onOpen}
      />
    </section>
  )
}

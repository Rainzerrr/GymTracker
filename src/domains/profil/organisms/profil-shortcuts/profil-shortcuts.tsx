import { useTranslation } from 'react-i18next'
import { ChevronIcon } from '@shared/atoms/chevron-icon'
import { IconChip } from '@shared/atoms/icon-chip'
import { SectionLabel } from '@shared/atoms/section-label'
import { ListRow } from '@shared/molecules/list-row'
import type { ProfilShortcutsProps } from './profil-shortcuts.types'

const sessionsIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18" />
  </svg>
)

const planningIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
  </svg>
)

const progressionIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path d="M4 19V10M12 19V4M20 19v-6" />
  </svg>
)

const settingsIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" strokeLinecap="round" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
)

export const ProfilShortcuts = ({
  onSessionsClick,
  onPlanningClick,
  onProgressionClick,
  onSettingsClick,
}: ProfilShortcutsProps) => {
  const { t } = useTranslation('profil')

  return (
    <section>
      <SectionLabel label={t('shortcuts.label')} />
      <ListRow
        leading={<IconChip icon={sessionsIcon} />}
        title={t('shortcuts.sessions')}
        trailing={<ChevronIcon />}
        onClick={onSessionsClick}
      />
      <ListRow
        leading={<IconChip icon={planningIcon} />}
        title={t('shortcuts.planning')}
        trailing={<ChevronIcon />}
        onClick={onPlanningClick}
      />
      <ListRow
        leading={<IconChip icon={progressionIcon} />}
        title={t('shortcuts.progression')}
        trailing={<ChevronIcon />}
        onClick={onProgressionClick}
      />
      <ListRow
        leading={<IconChip icon={settingsIcon} />}
        title={t('shortcuts.settings')}
        trailing={<ChevronIcon />}
        onClick={onSettingsClick}
      />
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { FilterPill } from '@shared/atoms/filter-pill'
import { SectionLabel } from '@shared/atoms/section-label'
import type { ThemePreference } from '@shared/utils/theme/apply-theme'
import './settings-appearance.scss'

const THEMES: ThemePreference[] = ['auto', 'light', 'dark']

type SettingsAppearanceProps = {
  theme: ThemePreference
  onThemeChange: (theme: ThemePreference) => void
}

export const SettingsAppearance = ({ theme, onThemeChange }: SettingsAppearanceProps) => {
  const { t } = useTranslation('reglages')

  return (
    <section>
      <SectionLabel label={t('appearance.label')} />
      <div className="settings-appearance__pills">
        {THEMES.map((option) => (
          <FilterPill
            key={option}
            label={t(`appearance.theme.${option}`)}
            active={theme === option}
            onClick={() => onThemeChange(option)}
          />
        ))}
      </div>
      <p className="settings-appearance__hint">{t('appearance.hint')}</p>
    </section>
  )
}

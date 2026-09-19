import { useTranslation } from 'react-i18next'
import { FilterPill } from '@shared/atoms/filter-pill'
import { SectionLabel } from '@shared/atoms/section-label'
import { REST_OPTIONS } from '@domains/seances/data/rest-options'
import { SettingToggleRow } from '../../molecules/setting-toggle-row'
import type { AppSettings } from '../../types/app-settings'
import './settings-session.scss'

type SettingsSessionProps = {
  settings: AppSettings
  onChange: (patch: Partial<AppSettings>) => void
}

export const SettingsSession = ({ settings, onChange }: SettingsSessionProps) => {
  const { t } = useTranslation('reglages')

  return (
    <section>
      <SectionLabel label={t('session.label')} />
      <SettingToggleRow
        title={t('session.restAlert')}
        subtitle={t('session.restAlertHint')}
        checked={settings.restAlert}
        onChange={(restAlert) => onChange({ restAlert })}
      />
      <SettingToggleRow
        title={t('session.keepScreenAwake')}
        subtitle={t('session.keepScreenAwakeHint')}
        checked={settings.keepScreenAwake}
        onChange={(keepScreenAwake) => onChange({ keepScreenAwake })}
      />
      <span className="settings-session__label">{t('session.defaultRest')}</span>
      <div className="settings-session__pills">
        {REST_OPTIONS.map((option) => (
          <FilterPill
            key={option}
            label={option}
            active={settings.defaultRest === option}
            onClick={() => onChange({ defaultRest: option })}
          />
        ))}
      </div>
    </section>
  )
}

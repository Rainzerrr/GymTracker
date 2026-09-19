import type { SettingToggleRowProps } from './setting-toggle-row.types'
import './setting-toggle-row.scss'

export const SettingToggleRow = ({ title, subtitle, checked, onChange }: SettingToggleRowProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className="setting-toggle-row"
    onClick={() => onChange(!checked)}
  >
    <span className="setting-toggle-row__text">
      <span className="setting-toggle-row__title">{title}</span>
      {subtitle && <span className="setting-toggle-row__subtitle">{subtitle}</span>}
    </span>
    <span
      className={`setting-toggle-row__switch ${checked ? 'setting-toggle-row__switch--on' : ''}`}
      aria-hidden="true"
    />
  </button>
)

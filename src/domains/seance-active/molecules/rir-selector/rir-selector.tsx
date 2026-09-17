import { useTranslation } from 'react-i18next'
import type { RirValue } from '../../types/rir-value'
import type { RirSelectorProps } from './rir-selector.types'
import './rir-selector.scss'

const RIR_OPTIONS: RirValue[] = ['0', '1', '2', '3', 'echec']

export const RirSelector = ({ value, onChange }: RirSelectorProps) => {
  const { t } = useTranslation('seanceActive')

  return (
    <div className="rir-selector">
      {RIR_OPTIONS.map((option) => {
        const label = option === 'echec' ? t('rirFailure') : option
        const className = `rir-selector__chip ${value === option ? 'rir-selector__chip--selected' : ''}`

        return (
          <button key={option} type="button" className={className} onClick={() => onChange(option)}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

import type { NumberFieldProps } from './number-field.types'
import './number-field.scss'

export const NumberField = ({ label, value, onChange }: NumberFieldProps) => {
  return (
    <div className="number-field">
      <span className="number-field__label">{label}</span>
      <input
        className="number-field__value"
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

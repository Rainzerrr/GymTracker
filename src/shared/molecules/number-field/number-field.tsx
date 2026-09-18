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
        min={0}
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
      />
    </div>
  )
}

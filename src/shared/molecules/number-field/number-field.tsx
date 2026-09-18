import { useNumberInputField } from '@shared/hooks/use-number-input-field'
import type { NumberFieldProps } from './number-field.types'
import './number-field.scss'

export const NumberField = ({ label, value, onChange }: NumberFieldProps) => {
  const { rawValue, handleChange, handleBlur } = useNumberInputField(value, onChange)

  return (
    <div className="number-field">
      <span className="number-field__label">{label}</span>
      <input
        className="number-field__value"
        type="number"
        inputMode="numeric"
        min={0}
        value={rawValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}

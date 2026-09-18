import { useState } from 'react'

/**
 * Keeps a numeric <input> free to sit empty while the user is typing,
 * instead of a controlled number snapping the field back to "0" the
 * instant it's cleared. The last valid value is restored on blur if
 * the field was left empty.
 */
export const useNumberInputField = (value: number, onChange: (value: number) => void, min = 0) => {
  const [rawValue, setRawValue] = useState(String(value))
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setRawValue(String(value))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setRawValue(next)

    if (next === '') {
      return
    }

    const parsed = Number(next)
    if (!Number.isNaN(parsed)) {
      onChange(Math.max(min, parsed))
    }
  }

  const handleBlur = () => {
    if (rawValue === '') {
      setRawValue(String(value))
    }
  }

  return { rawValue, handleChange, handleBlur }
}

import { useTranslation } from 'react-i18next'
import type { ExerciseNoteProps } from './exercise-note.types'
import './exercise-note.scss'

export const ExerciseNote = ({ value, onChange }: ExerciseNoteProps) => {
  const { t } = useTranslation('seanceActive')

  return (
    <label className="exercise-note">
      <span className="exercise-note__label">{t('note.label')}</span>
      <textarea
        className="exercise-note__input"
        rows={2}
        value={value}
        placeholder={t('note.placeholder')}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

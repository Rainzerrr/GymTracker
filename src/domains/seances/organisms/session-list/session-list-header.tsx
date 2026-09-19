import { useTranslation } from 'react-i18next'
import type { SessionListHeaderProps } from './session-list.types'
import './session-list.scss'

export const SessionListHeader = ({
  sessionCount,
  editMode,
  onToggleEditMode,
}: SessionListHeaderProps) => {
  const { t } = useTranslation('seances')
  const { t: tCommon } = useTranslation('common')

  return (
    <div>
      <div className="session-list__header">
        <span className="session-list__title">{t('list.title')}</span>
        <button type="button" className="session-list__edit-toggle" onClick={onToggleEditMode}>
          {editMode ? tCommon('actions.done') : tCommon('actions.edit')}
        </button>
      </div>
      <p className="session-list__subtitle">{t('list.subtitle', { count: sessionCount })}</p>
    </div>
  )
}

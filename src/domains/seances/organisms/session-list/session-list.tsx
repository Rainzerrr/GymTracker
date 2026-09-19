import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { ChevronIcon } from '@shared/atoms/chevron-icon'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { ListRow } from '@shared/molecules/list-row'
import type { SessionListProps } from './session-list.types'
import './session-list.scss'

export const SessionList = ({
  sessions,
  editMode,
  onSelect,
  onDelete,
  onDuplicate,
  onCreate,
  onInstallStarter,
}: SessionListProps) => {
  const { t } = useTranslation('seances')
  const { t: tCommon } = useTranslation('common')

  return (
    <div className="session-list">
      {sessions.length === 0 && (
        <div className="session-list__empty">
          <p className="session-list__empty-text">{t('list.empty')}</p>
          <Button
            label={t('list.installStarter')}
            variant="outline"
            fullWidth
            onClick={onInstallStarter}
          />
        </div>
      )}
      <div>
        {sessions.map((session) => (
          <ListRow
            key={session.id}
            leading={
              <>
                {editMode && (
                  <button
                    type="button"
                    className="session-list__delete"
                    onClick={() => onDelete(session.id)}
                    aria-label={tCommon('actions.delete')}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                )}
                <Thumbnail src={session.imageUrl} alt={session.name} />
              </>
            }
            title={session.name}
            subtitle={session.subtitle}
            trailing={
              editMode ? (
                <button
                  type="button"
                  className="session-list__duplicate"
                  onClick={() => onDuplicate(session.id)}
                >
                  {t('list.duplicate')}
                </button>
              ) : (
                <ChevronIcon />
              )
            }
            onClick={editMode ? undefined : () => onSelect(session.id)}
          />
        ))}
      </div>

      <Button label={t('list.newSession')} variant="accent" fullWidth onClick={onCreate} />
    </div>
  )
}

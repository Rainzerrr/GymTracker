import { useTranslation } from 'react-i18next'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { ListRow } from '@shared/molecules/list-row'
import type { HistoryEntry } from '../../types/history-entry'

type HistorySessionsViewProps = {
  entries: HistoryEntry[]
}

export const HistorySessionsView = ({ entries }: HistorySessionsViewProps) => {
  const { t } = useTranslation('progression')

  if (entries.length === 0) {
    return <p className="history-log__empty">{t('history.empty')}</p>
  }

  return (
    <div>
      {entries.map((entry) => (
        <ListRow
          key={entry.id}
          leading={<Thumbnail src={entry.thumbnailUrl} alt={entry.sessionName} />}
          title={`${entry.dateLabel} · ${entry.sessionName}`}
          subtitle={entry.metaLabel}
          trailing={<span className="history-log__xp-tag">+{entry.xpGained}</span>}
        />
      ))}
    </div>
  )
}

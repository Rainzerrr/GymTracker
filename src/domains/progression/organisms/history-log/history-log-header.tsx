import { useTranslation } from 'react-i18next'
import { SegmentedToggle } from '../../molecules/segmented-toggle'
import type { HistoryLogHeaderProps } from './history-log.types'
import './history-log.scss'

export const HistoryLogHeader = ({
  activeView,
  onViewChange,
  totalSessionsCount,
}: HistoryLogHeaderProps) => {
  const { t } = useTranslation('progression')

  return (
    <div className="history-log">
      <div className="history-log__header">
        <span className="history-log__title">{t('history.headerTitle')}</span>
        <p className="history-log__subtitle">
          {t('history.subtitle', { count: totalSessionsCount })}
        </p>
      </div>

      <SegmentedToggle
        value={activeView}
        onChange={(value) => onViewChange(value as HistoryLogHeaderProps['activeView'])}
        options={[
          { value: 'sessions', label: t('history.toggle.sessions') },
          { value: 'chart', label: t('history.toggle.chart') },
        ]}
      />
    </div>
  )
}

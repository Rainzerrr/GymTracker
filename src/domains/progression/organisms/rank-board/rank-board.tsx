import { useTranslation } from 'react-i18next'
import { TierCountPill } from '../../atoms/tier-count-pill'
import { RankItemCard } from '../../molecules/rank-item-card'
import { SegmentedToggle } from '../../molecules/segmented-toggle'
import { countByTier } from '../../utils/count-by-tier'
import { sortByTier } from '../../utils/sort-by-tier'
import type { RankBoardProps } from './rank-board.types'
import './rank-board.scss'

export const RankBoard = ({
  activeTab,
  onTabChange,
  exercises,
  muscles,
  onItemClick,
}: RankBoardProps) => {
  const { t } = useTranslation('progression')

  const items = sortByTier(activeTab === 'exercises' ? exercises : muscles)
  const tierCounts = countByTier(items)

  return (
    <div className="rank-board">
      <p className="rank-board__subtitle">{t('rank.subtitle')}</p>
      <SegmentedToggle
        value={activeTab}
        onChange={(value) => onTabChange(value as RankBoardProps['activeTab'])}
        options={[
          { value: 'exercises', label: t('rank.toggle.exercises') },
          { value: 'muscles', label: t('rank.toggle.muscles') },
        ]}
      />

      <div className="rank-board__tier-counts">
        {tierCounts.map((entry) => (
          <TierCountPill
            key={entry.tier}
            tier={entry.tier}
            label={t(`tiers.${entry.tier}`)}
            count={entry.count}
          />
        ))}
      </div>

      {items.length === 0 ? (
        <p className="rank-board__empty">{t('rank.empty')}</p>
      ) : (
        <div className="rank-board__list">
          {items.map((item) => (
            <RankItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
          ))}
        </div>
      )}
    </div>
  )
}

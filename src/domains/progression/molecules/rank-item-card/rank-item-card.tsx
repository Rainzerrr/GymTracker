import { useTranslation } from 'react-i18next'
import { RankAvatar } from '../../atoms/rank-avatar'
import { TierProgressBar } from '../../atoms/tier-progress-bar'
import { getNextTargetRemainingKey } from '../../utils/get-next-target-copy'
import { getSubLevelRoman } from '../../utils/get-sub-level-roman'
import type { RankItemCardProps } from './rank-item-card.types'
import './rank-item-card.scss'

export const RankItemCard = ({ item, onClick }: RankItemCardProps) => {
  const { t } = useTranslation('progression')
  const isMaxed = item.tier === 'platine' && item.subLevel === 3 && item.progressPercent >= 100

  return (
    <button
      type="button"
      className={`rank-item-card rank-item-card--${item.tier}`}
      onClick={onClick}
    >
      <RankAvatar tier={item.tier} photoUrl={item.photoUrl} label={item.name} size="lg" />
      <span className="rank-item-card__name">{item.name}</span>
      <span className="rank-item-card__tier">
        {t(`tiers.${item.tier}`)} {getSubLevelRoman(item.subLevel)}
      </span>
      <span className="rank-item-card__progress">
        <TierProgressBar tier={item.tier} progressPercent={item.progressPercent} />
      </span>
      {isMaxed ? (
        <span className="rank-item-card__hint rank-item-card__hint--maxed">
          {t('rank.detail.maxed')}
        </span>
      ) : (
        item.nextRankTarget && (
          <span className="rank-item-card__hint">
            {t(getNextTargetRemainingKey(item.nextRankTarget), {
              value: item.nextRankTarget.remaining,
            })}
          </span>
        )
      )}
    </button>
  )
}

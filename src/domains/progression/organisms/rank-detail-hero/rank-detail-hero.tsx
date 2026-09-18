import { useTranslation } from 'react-i18next'
import { RankAvatar } from '../../atoms/rank-avatar'
import { TierProgressBar } from '../../atoms/tier-progress-bar'
import { getSubLevelRoman } from '../../utils/get-sub-level-roman'
import type { RankDetailHeroProps } from './rank-detail-hero.types'
import './rank-detail-hero.scss'

export const RankDetailHero = ({ item, stepNumber, totalSteps }: RankDetailHeroProps) => {
  const { t } = useTranslation('progression')
  const isMaxed = item.tier === 'platine' && item.subLevel === 3 && item.progressPercent >= 100

  return (
    <section className={`rank-detail-hero rank-detail-hero--${item.tier}`}>
      <RankAvatar tier={item.tier} photoUrl={item.photoUrl} label={item.name} size="lg" />
      <p className="rank-detail-hero__eyebrow">{t('rank.detail.currentTier')}</p>
      <h1 className="rank-detail-hero__tier">
        {t(`tiers.${item.tier}`)} {getSubLevelRoman(item.subLevel)}
      </h1>
      <span className="rank-detail-hero__step-pill">
        {t('rank.detail.stepStatus', { current: stepNumber, total: totalSteps })}
      </span>

      {isMaxed ? (
        <p className="rank-detail-hero__maxed">{t('rank.detail.maxed')}</p>
      ) : (
        <div className="rank-detail-hero__progress">
          <TierProgressBar tier={item.tier} progressPercent={item.progressPercent} />
          <p className="rank-detail-hero__hint">
            {item.nextRankTarget
              ? t(
                  item.nextRankTarget.unit === 'kg'
                    ? 'rank.detail.targetWeighted'
                    : 'rank.detail.targetBodyweight',
                  { value: item.nextRankTarget.value },
                )
              : t('rank.detail.progressHint', { percent: item.progressPercent })}
          </p>
        </div>
      )}
    </section>
  )
}

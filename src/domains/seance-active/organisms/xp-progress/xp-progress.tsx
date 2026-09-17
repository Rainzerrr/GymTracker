import { useTranslation } from 'react-i18next'
import type { XpProgressProps } from './xp-progress.types'
import './xp-progress.scss'

export const XpProgress = ({ xpGained, level, levelTitle, currentXp, xpToNextLevel }: XpProgressProps) => {
  const { t } = useTranslation('seanceActive')
  const progressPercent = (currentXp / xpToNextLevel) * 100

  return (
    <div className="xp-progress">
      <div className="xp-progress__xp-number">{t('recap.xpGained', { amount: xpGained })}</div>
      <p className="xp-progress__xp-label">{t('recap.xpLabel')}</p>
      <div className="xp-progress__level-row">
        <span>{t('recap.levelLabel', { level, title: levelTitle })}</span>
        <span>{t('recap.xpFraction', { current: currentXp, total: xpToNextLevel })}</span>
      </div>
      <div className="xp-progress__level-bar">
        <div className="xp-progress__level-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  )
}

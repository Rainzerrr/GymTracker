import { useTranslation } from 'react-i18next'
import type { PlayerLevelBarProps } from './player-level-bar.types'
import './player-level-bar.scss'

const laurelIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path d="M12 3l1.7 3.6L17.5 7l-2.6 2.9.6 3.9L12 11.9 8.5 13.8l.6-3.9L6.5 7l3.8-.4L12 3z" strokeLinejoin="round" />
  </svg>
)

export const PlayerLevelBar = ({ level, levelTitle, currentXp, xpToNextLevel }: PlayerLevelBarProps) => {
  const { t } = useTranslation('home')
  const progressPercent = Math.min(100, Math.round((currentXp / xpToNextLevel) * 100))

  return (
    <section className="player-level-bar">
      <div className="player-level-bar__badge">
        {laurelIcon}
        <span className="player-level-bar__badge-level">{level}</span>
      </div>
      <div className="player-level-bar__info">
        <div className="player-level-bar__top-row">
          <span className="player-level-bar__title">{t('playerLevel.levelLabel', { level, title: levelTitle })}</span>
          <span className="player-level-bar__fraction">
            {t('playerLevel.xpFraction', { current: currentXp, total: xpToNextLevel })}
          </span>
        </div>
        <div className="player-level-bar__bar">
          <div className="player-level-bar__bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </section>
  )
}

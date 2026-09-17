import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import recapDemo from '../../data/session-recap-demo.json'
import { SessionHighlights } from '../../organisms/session-highlights'
import type { SessionHighlight } from '../../organisms/session-highlights'
import { SessionSummaryHero } from '../../organisms/session-summary-hero'
import { XpProgress } from '../../organisms/xp-progress'
import type { SessionSummary } from '../../types/session-summary'
import './session-recap-page.scss'

const highlights = recapDemo.highlights as SessionHighlight[]

export const SessionRecapPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('seanceActive')
  const [summary] = useLocalStorageState<SessionSummary | null>('seance-active/last-summary', null)

  useEffect(() => {
    if (!summary) {
      navigate('/', { replace: true })
    }
  }, [summary, navigate])

  if (!summary) {
    return null
  }

  const metaLabel = t('recap.meta', { duration: summary.durationMinutes })

  return (
    <div className="session-recap-page">
      <SessionSummaryHero
        title={summary.title}
        imageUrl={summary.imageUrl}
        metaLabel={metaLabel}
        onClose={() => navigate('/')}
      />
      <div className="session-recap-page__content">
        <XpProgress
          xpGained={recapDemo.xp.gained}
          level={recapDemo.xp.level}
          levelTitle={recapDemo.xp.levelTitle}
          currentXp={recapDemo.xp.currentXp}
          xpToNextLevel={recapDemo.xp.xpToNextLevel}
        />
        <SectionLabel label={t('recap.sectionLabel')} />
        <SessionHighlights highlights={highlights} />
        <Button label={t('recap.backToHome')} variant="accent" fullWidth onClick={() => navigate('/')} />
      </div>
    </div>
  )
}

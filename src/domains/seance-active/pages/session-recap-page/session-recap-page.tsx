import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { useSessionRecap } from '../../hooks/use-session-recap'
import { SessionHighlights } from '../../organisms/session-highlights'
import type { SessionHighlight } from '../../organisms/session-highlights'
import { SessionSummaryHero } from '../../organisms/session-summary-hero'
import { XpProgress } from '../../organisms/xp-progress'
import './session-recap-page.scss'

const PR_XP_BONUS = 30
const TIER_UP_XP_BONUS = 50

export const SessionRecapPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('seanceActive')
  const { t: tProgression } = useTranslation('progression')
  const { summary, xpGained, level, levelTitle, currentXp, xpToNextLevel, highlights } =
    useSessionRecap()

  useEffect(() => {
    if (!summary) {
      navigate('/', { replace: true })
    }
  }, [summary, navigate])

  if (!summary) {
    return null
  }

  const metaLabel = t('recap.meta', { duration: summary.durationMinutes })

  const translatedHighlights: SessionHighlight[] = highlights.map((highlight, index) => {
    if (highlight.kind === 'pr') {
      return {
        id: `pr-${index}`,
        icon: 'star',
        title: t('recap.highlights.prTitle'),
        subtitle: highlight.isBodyweight
          ? t('recap.highlights.prSubtitleBodyweight', {
              name: highlight.exerciseName,
              value: Math.round(highlight.value),
            })
          : t('recap.highlights.prSubtitleWeighted', {
              name: highlight.exerciseName,
              value: Math.round(highlight.value * 10) / 10,
            }),
        xpValue: PR_XP_BONUS,
      }
    }

    if (highlight.kind === 'tierUp') {
      return {
        id: `tier-${index}`,
        icon: 'up',
        title: t('recap.highlights.tierUpTitle'),
        subtitle: t('recap.highlights.tierUpSubtitle', {
          name: highlight.exerciseName,
          tier: tProgression(`tiers.${highlight.tier}`),
        }),
        xpValue: TIER_UP_XP_BONUS,
      }
    }

    if (highlight.kind === 'streak') {
      return {
        id: 'streak',
        icon: 'streak',
        title: t('recap.highlights.streakTitle'),
        subtitle: t('recap.highlights.streakSubtitle', { count: highlight.sessions }),
      }
    }

    return {
      id: 'first',
      icon: 'star',
      title: t('recap.highlights.firstTitle'),
      subtitle: t('recap.highlights.firstSubtitle'),
    }
  })

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
          xpGained={xpGained}
          level={level}
          levelTitle={levelTitle}
          currentXp={currentXp}
          xpToNextLevel={xpToNextLevel}
        />
        <SectionLabel label={t('recap.sectionLabel')} />
        <SessionHighlights highlights={translatedHighlights} />
        <Button
          label={t('recap.backToHome')}
          variant="accent"
          fullWidth
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  )
}

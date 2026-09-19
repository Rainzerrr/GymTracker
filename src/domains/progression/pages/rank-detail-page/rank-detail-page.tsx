import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { SectionLabel } from '@shared/atoms/section-label'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { useProgressionRanks } from '../../hooks/use-progression-ranks'
import type { RankBoardTab } from '../../organisms/rank-board'
import { RankDetailHero } from '../../organisms/rank-detail-hero'
import { TierLadder } from '../../organisms/tier-ladder'
import type { RankedItem } from '../../types/ranked-item'
import { buildTierLadder } from '../../utils/build-tier-ladder'

export const RankDetailPage = () => {
  const { category, itemId } = useParams<{ category: RankBoardTab; itemId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('progression')
  const { t: tSeances } = useTranslation('seances')
  const { exercises, muscles } = useProgressionRanks()

  const translatedMuscles: RankedItem[] = muscles.map((muscle) => ({
    ...muscle,
    name: tSeances(`muscleGroups.${muscle.id}`),
  }))

  const items = category === 'muscles' ? translatedMuscles : exercises
  const item = items.find((candidate) => candidate.id === itemId)

  useEffect(() => {
    if (!item) {
      navigate('/progression/rangs', { replace: true })
    }
  }, [item, navigate])

  if (!item) {
    return null
  }

  const ladder = buildTierLadder(item.tier, item.subLevel)
  const currentStepIndex = ladder.findIndex((step) => step.status === 'current')
  const stepNumber = ladder.length - currentStepIndex

  return (
    <PageTemplate
      header={<BackHeader title={item.name} onBack={() => navigate('/progression/rangs')} />}
    >
      <RankDetailHero item={item} stepNumber={stepNumber} totalSteps={ladder.length} />
      <SectionLabel label={t('rank.detail.ladderTitle')} />
      <TierLadder steps={ladder} />
    </PageTemplate>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { useProgressionRanks } from '../../hooks/use-progression-ranks'
import { RankBoard } from '../../organisms/rank-board'
import type { RankBoardTab } from '../../organisms/rank-board'

export const RankPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('progression')
  const { t: tSeances } = useTranslation('seances')
  const { exercises, muscles } = useProgressionRanks()
  const [activeTab, setActiveTab] = useState<RankBoardTab>('exercises')

  const translatedMuscles = muscles.map((muscle) => ({
    ...muscle,
    name: tSeances(`muscleGroups.${muscle.id}`),
  }))

  return (
    <PageTemplate>
      <BackHeader title={t('rank.headerTitle')} onBack={() => navigate('/')} />
      <RankBoard
        activeTab={activeTab}
        onTabChange={setActiveTab}
        exercises={exercises}
        muscles={translatedMuscles}
        onItemClick={(item) => navigate(`/progression/rangs/${activeTab}/${item.id}`)}
      />
    </PageTemplate>
  )
}

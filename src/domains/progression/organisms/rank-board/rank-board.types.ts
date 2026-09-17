import type { RankedItem } from '../../types/ranked-item'

export type RankBoardTab = 'exercises' | 'muscles'

export type RankBoardProps = {
  activeTab: RankBoardTab
  onTabChange: (tab: RankBoardTab) => void
  exercises: RankedItem[]
  muscles: RankedItem[]
}

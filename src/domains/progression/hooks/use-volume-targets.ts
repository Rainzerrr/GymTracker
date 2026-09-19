import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { isRecord } from '@shared/utils/storage/guards'
import type { Muscle } from '@domains/seances/types/muscle'
import { WEEKLY_TARGET_SETS } from '../data/muscle-config'

const STORAGE_KEY = 'reglages/volume-targets'

type TargetOverrides = Partial<Record<Muscle, number>>

// Objectifs hebdomadaires en séries : ceux par défaut, surchargés muscle par muscle.
export const useVolumeTargets = () => {
  const [overrides, setOverrides] = useLocalStorageState<TargetOverrides>(
    STORAGE_KEY,
    {},
    {
      isValid: isRecord<TargetOverrides>,
    },
  )

  const targets: Record<Muscle, number> = { ...WEEKLY_TARGET_SETS, ...overrides }

  const setTarget = (muscle: Muscle, sets: number) =>
    setOverrides((current) => ({ ...current, [muscle]: sets }))

  const resetTargets = () => setOverrides({})

  return { targets, setTarget, resetTargets, hasCustomTargets: Object.keys(overrides).length > 0 }
}

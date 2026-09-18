import type { NextRankTarget } from '../types/ranked-item'

export const getNextTargetHintKey = (target: NextRankTarget): string => {
  if (target.unit === 'reps') {
    return 'rank.detail.targetBodyweight'
  }

  if (target.unit === 'seconds') {
    return 'rank.detail.targetSeconds'
  }

  if (target.perHand !== undefined) {
    return 'rank.detail.targetPerHand'
  }

  return target.includesBodyweight
    ? 'rank.detail.targetWithBodyweight'
    : 'rank.detail.targetWeighted'
}

export const getNextTargetRemainingKey = (target: NextRankTarget): string => {
  if (target.unit === 'reps') {
    return 'rank.board.remainingBodyweight'
  }

  return target.unit === 'seconds' ? 'rank.board.remainingSeconds' : 'rank.board.remainingWeighted'
}

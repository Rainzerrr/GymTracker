export const buildGroups = (linkedToNextByIndex: boolean[]): number[][] => {
  const groups: number[][] = []

  linkedToNextByIndex.forEach((_unused, index) => {
    if (index === 0 || !linkedToNextByIndex[index - 1]) {
      groups.push([index])
    } else {
      groups[groups.length - 1].push(index)
    }
  })

  return groups
}

const findNextInGroup = (
  group: number[],
  currentExerciseIndex: number,
  nextProgress: number[],
  setCounts: number[],
): { index: number } | null => {
  const currentPosition = group.indexOf(currentExerciseIndex)

  for (let offset = 1; offset <= group.length; offset += 1) {
    const candidatePosition = (currentPosition + offset) % group.length
    const candidateIndex = group[candidatePosition]

    if (nextProgress[candidateIndex] < setCounts[candidateIndex]) {
      return { index: candidateIndex }
    }
  }

  return null
}

export const resolveNextStep = (
  currentGroup: number[],
  currentExerciseIndex: number,
  nextProgress: number[],
  setCounts: number[],
): number => {
  const groupMatch = findNextInGroup(currentGroup, currentExerciseIndex, nextProgress, setCounts)

  return groupMatch
    ? groupMatch.index
    : nextProgress.findIndex((count, index) => count < setCounts[index])
}

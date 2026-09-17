export const parseSetCount = (targetLabel: string): number => {
  const match = targetLabel.match(/\d+/)

  return match ? Number(match[0]) : 1
}

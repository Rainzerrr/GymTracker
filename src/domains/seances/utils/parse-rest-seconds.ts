const DEFAULT_REST_SECONDS = 90

export const parseRestSeconds = (restLabel: string): number => {
  const cleaned = restLabel.replace('repos', '').trim()

  const minuteMatch = cleaned.match(/(\d+)min(\d+)?/)
  if (minuteMatch) {
    const minutes = Number(minuteMatch[1])
    const seconds = minuteMatch[2] ? Number(minuteMatch[2]) : 0

    return minutes * 60 + seconds
  }

  const secondMatch = cleaned.match(/(\d+)(?:-(\d+))?s/)
  if (secondMatch) {
    const first = Number(secondMatch[1])
    const second = secondMatch[2] ? Number(secondMatch[2]) : first

    return Math.round((first + second) / 2)
  }

  return DEFAULT_REST_SECONDS
}

import type { SetLogEntry } from '@domains/seance-active/types/set-log-entry'

export type HistoryExerciseCardProps = {
  name: string
  thumbnailUrl: string
  sets: SetLogEntry[]
}

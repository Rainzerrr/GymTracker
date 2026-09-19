export type SessionListItem = {
  id: string
  name: string
  subtitle: string
  imageUrl: string
}

export type SessionListProps = {
  sessions: SessionListItem[]
  editMode: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onCreate: () => void
}

export type SessionListHeaderProps = {
  sessionCount: number
  editMode: boolean
  onToggleEditMode: () => void
}

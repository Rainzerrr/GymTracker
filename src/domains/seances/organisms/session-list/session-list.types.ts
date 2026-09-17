export type SessionListItem = {
  id: string
  name: string
  subtitle: string
  imageUrl: string
}

export type SessionListProps = {
  sessions: SessionListItem[]
  editMode: boolean
  onToggleEditMode: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onCreate: () => void
}

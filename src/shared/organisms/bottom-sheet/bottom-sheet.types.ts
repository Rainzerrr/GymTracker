import type { ReactNode } from 'react'

export type BottomSheetProps = {
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
}

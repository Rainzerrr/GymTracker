import type { ReactNode } from 'react'

export type ListRowProps = {
  title: string
  leading?: ReactNode
  subtitle?: string
  meta?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
}

import type { ReactNode } from 'react'

export type PageTemplateProps = {
  // Stays pinned to the top while `children` scroll underneath it.
  header?: ReactNode
  children: ReactNode
}

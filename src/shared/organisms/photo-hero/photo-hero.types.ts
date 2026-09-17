import type { ReactNode } from 'react'

export type PhotoHeroProps = {
  imageUrl: string
  alt: string
  title: string
  meta: string
  heightRem: number
  topLeft?: ReactNode
  topRight?: ReactNode
}

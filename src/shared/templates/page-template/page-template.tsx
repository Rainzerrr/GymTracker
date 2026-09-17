import type { PageTemplateProps } from './page-template.types'
import './page-template.scss'

export const PageTemplate = ({ children }: PageTemplateProps) => {
  return <main className="page-template">{children}</main>
}

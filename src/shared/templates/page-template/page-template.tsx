import type { PageTemplateProps } from './page-template.types'
import './page-template.scss'

export const PageTemplate = ({ header, children }: PageTemplateProps) => {
  return (
    <div className="page-template">
      {header && <header className="page-template__header">{header}</header>}
      <main
        className={`page-template__content ${header ? 'page-template__content--with-header' : ''}`}
        data-scroll-container
      >
        <div className="page-template__body">{children}</div>
      </main>
    </div>
  )
}

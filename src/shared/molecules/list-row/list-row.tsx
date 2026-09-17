import type { ListRowProps } from './list-row.types'
import './list-row.scss'

export const ListRow = ({ title, leading, subtitle, meta, trailing, onClick }: ListRowProps) => {
  const content = (
    <>
      <span className="list-row__leading-group">
        {leading}
        <span className="list-row__text">
          <span className="list-row__title">{title}</span>
          {subtitle && <span className="list-row__subtitle">{subtitle}</span>}
          {meta}
        </span>
      </span>
      {trailing}
    </>
  )

  if (onClick) {
    return (
      <button type="button" className="list-row" onClick={onClick}>
        {content}
      </button>
    )
  }

  return <div className="list-row">{content}</div>
}

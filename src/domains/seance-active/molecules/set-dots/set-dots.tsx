import './set-dots.scss'

type SetDotsProps = {
  total: number
  filled: number
}

export const SetDots = ({ total, filled }: SetDotsProps) => {
  return (
    <div className="set-dots">
      {Array.from({ length: total }, (_unused, index) => (
        <span
          key={index}
          className={`set-dots__dot ${index < filled ? 'set-dots__dot--filled' : ''}`}
        />
      ))}
    </div>
  )
}

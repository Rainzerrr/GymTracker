import './mini-dots.scss'

type MiniDotsProps = {
  values: boolean[]
}

export const MiniDots = ({ values }: MiniDotsProps) => {
  return (
    <div className="mini-dots">
      {values.map((isOn, index) => (
        <span key={index} className={`mini-dots__dot ${isOn ? 'mini-dots__dot--on' : ''}`} />
      ))}
    </div>
  )
}

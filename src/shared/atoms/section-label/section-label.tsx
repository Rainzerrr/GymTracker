import './section-label.scss'

type SectionLabelProps = {
  label: string
}

export const SectionLabel = ({ label }: SectionLabelProps) => {
  return <h2 className="section-label">{label}</h2>
}

import type { Muscle } from '@domains/seances/types/muscle'
import frontBodyPaths from '../../data/front-body-paths.json'
import backBodyPaths from '../../data/back-body-paths.json'
import type { BodyFigureProps } from './body-figure.types'
import './body-figure.scss'

type BodyPathEntry = {
  d: string
  muscle: Muscle | null
}

const FRONT_BODY_PATHS = frontBodyPaths as BodyPathEntry[]
const BACK_BODY_PATHS = backBodyPaths as BodyPathEntry[]

const VIEW_BOX: Record<BodyFigureProps['view'], string> = {
  front: '0 0 724 1448',
  back: '724 0 724 1448',
}

export const BodyFigure = ({
  view,
  statusByMuscle,
  selectedMuscle,
  onSelectMuscle,
}: BodyFigureProps) => {
  const paths = view === 'front' ? FRONT_BODY_PATHS : BACK_BODY_PATHS

  return (
    <svg className="body-figure" viewBox={VIEW_BOX[view]} aria-hidden="true">
      {paths.map(({ d, muscle }, index) => {
        if (!muscle) {
          return <path key={index} d={d} className="body-figure__zone" />
        }

        const classNames = [
          'body-figure__zone',
          `body-figure__zone--${statusByMuscle[muscle] ?? 'none'}`,
          'body-figure__zone--selectable',
          muscle === selectedMuscle ? 'body-figure__zone--selected' : '',
        ]

        return (
          <path
            key={index}
            d={d}
            className={classNames.join(' ')}
            onClick={() => onSelectMuscle(muscle)}
          />
        )
      })}
    </svg>
  )
}

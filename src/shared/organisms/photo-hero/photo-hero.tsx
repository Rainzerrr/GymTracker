import type { PhotoHeroProps } from './photo-hero.types'
import './photo-hero.scss'

export const PhotoHero = ({
  imageUrl,
  alt,
  title,
  meta,
  heightRem,
  topLeft,
  topRight,
}: PhotoHeroProps) => {
  const hasTopRow = Boolean(topLeft) || Boolean(topRight)

  return (
    <div className="photo-hero" style={{ height: `${heightRem}rem` }}>
      <img className="photo-hero__image" src={imageUrl} alt={alt} />
      {hasTopRow && (
        <div className="photo-hero__top-row">
          {topLeft}
          {topRight}
        </div>
      )}
      <div className="photo-hero__overlay">
        <h1 className="photo-hero__title">{title}</h1>
        <p className="photo-hero__meta">{meta}</p>
      </div>
    </div>
  )
}

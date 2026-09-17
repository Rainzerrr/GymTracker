import './thumbnail.scss'

type ThumbnailProps = {
  src: string
  alt: string
}

export const Thumbnail = ({ src, alt }: ThumbnailProps) => {
  if (!src) {
    return <span className="thumbnail thumbnail--placeholder" aria-hidden="true" />
  }

  return <img className="thumbnail" src={src} alt={alt} loading="lazy" />
}

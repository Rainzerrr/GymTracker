import { resolveThumbnailUrl } from '@shared/utils/image/image-url'
import './thumbnail.scss'

type ThumbnailProps = {
  src: string
  alt: string
}

export const Thumbnail = ({ src, alt }: ThumbnailProps) => {
  if (!src) {
    return <span className="thumbnail thumbnail--placeholder" aria-hidden="true" />
  }

  return (
    <img
      className="thumbnail"
      src={resolveThumbnailUrl(src)}
      alt={alt}
      width={320}
      height={320}
      loading="lazy"
      decoding="async"
    />
  )
}

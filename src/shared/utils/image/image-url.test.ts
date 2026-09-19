import { describe, expect, it } from 'vitest'
import { resolveImageUrl, resolveThumbnailUrl } from './image-url'

describe('resolveImageUrl', () => {
  it('traduit les anciennes URLs jpg vers webp', () => {
    expect(resolveImageUrl('/images/exercises/squat-barbell.jpg')).toBe(
      '/images/exercises/squat-barbell.webp',
    )
    expect(resolveImageUrl('/images/workouts/push.JPEG')).toBe('/images/workouts/push.webp')
  })

  it('laisse intactes les URLs déjà en webp ou vides', () => {
    expect(resolveImageUrl('/images/exercises/squat-barbell.webp')).toBe(
      '/images/exercises/squat-barbell.webp',
    )
    expect(resolveImageUrl('')).toBe('')
  })
})

describe('resolveThumbnailUrl', () => {
  it('pointe vers la vignette du même dossier', () => {
    expect(resolveThumbnailUrl('/images/exercises/squat-barbell.jpg')).toBe(
      '/images/exercises/thumbs/squat-barbell.webp',
    )
    expect(resolveThumbnailUrl('/images/workouts/push.webp')).toBe(
      '/images/workouts/thumbs/push.webp',
    )
  })

  it('ne double pas le dossier de vignettes', () => {
    expect(resolveThumbnailUrl('/images/exercises/thumbs/squat-barbell.webp')).toBe(
      '/images/exercises/thumbs/squat-barbell.webp',
    )
  })

  it('ne touche pas aux images externes', () => {
    expect(resolveThumbnailUrl('https://example.com/photo.png')).toBe(
      'https://example.com/photo.png',
    )
  })
})

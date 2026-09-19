const LEGACY_EXTENSION = /\.jpe?g$/i
const THUMBS_FOLDER_SUFFIX = /\/([^/]+)$/

// Les données déjà stockées (séances, historique, sauvegardes) peuvent encore pointer vers les
// anciens `.jpg` : les photos ne sont plus servies qu'en WebP.
export const resolveImageUrl = (url: string): string => url.replace(LEGACY_EXTENSION, '.webp')

// Vignette carrée de l'image, pour les listes et avatars. Les images hors `/images/` restent telles quelles.
export const resolveThumbnailUrl = (url: string): string => {
  const fullUrl = resolveImageUrl(url)
  const isLocalImage = fullUrl.startsWith('/images/') && fullUrl.endsWith('.webp')

  return isLocalImage && !fullUrl.includes('/thumbs/')
    ? fullUrl.replace(THUMBS_FOLDER_SUFFIX, '/thumbs/$1')
    : fullUrl
}

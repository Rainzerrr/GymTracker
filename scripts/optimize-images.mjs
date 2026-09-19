// Génère les WebP servis par l'app à partir des photos sources de `assets-src/images` :
//   public/images/<dossier>/<nom>.webp          version pleine (cartes, héros), 1200 px max
//   public/images/<dossier>/thumbs/<nom>.webp   vignette carrée (listes, avatars)
// Usage : npm run optimize:images
import { mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const SOURCE_ROOT = 'assets-src/images'
const OUTPUT_ROOT = 'public/images'
const FULL_MAX_WIDTH = 1200
const THUMB_SIZE = 320
// Qualité élevée : à 85 avec sous-échantillonnage chroma intelligent, la différence avec le JPEG
// source n'est pas visible, pour un poids environ deux fois moindre.
const WEBP_OPTIONS = { quality: 85, effort: 6, smartSubsample: true }

const folders = ['exercises', 'workouts']

for (const folder of folders) {
  const sourceDir = join(SOURCE_ROOT, folder)
  const fullDir = join(OUTPUT_ROOT, folder)
  const thumbDir = join(fullDir, 'thumbs')
  await mkdir(thumbDir, { recursive: true })

  const files = (await readdir(sourceDir)).filter((file) => /\.jpe?g$/i.test(file))

  for (const file of files) {
    const name = file.replace(/\.jpe?g$/i, '')
    const source = join(sourceDir, file)

    await sharp(source)
      .rotate()
      .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
      .webp(WEBP_OPTIONS)
      .toFile(join(fullDir, `${name}.webp`))

    await sharp(source)
      .rotate()
      .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: 'cover' })
      .webp(WEBP_OPTIONS)
      .toFile(join(thumbDir, `${name}.webp`))
  }

  console.log(`${folder}: ${files.length} images`)
}

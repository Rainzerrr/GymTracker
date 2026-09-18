import type { StandardLevels, StrengthStandard } from '../types/strength-standard'

// Référence : homme de 80 kg, tables « Strength Level » (strengthlevel.com, 1RM en kg).
// [Débutant, Novice, Intermédiaire, Avancé, Élite]
// Les lignes marquées « estimation » n'ont pas de table publiée : elles sont dérivées
// d'un exercice proche (ratio indiqué) ou estimées, et sont à ajuster si besoin.

export const STANDARDS_REFERENCE_BODY_WEIGHT_KG = 80

const REFERENCE_BODY_WEIGHT_KG = STANDARDS_REFERENCE_BODY_WEIGHT_KG

const scale = (levels: StandardLevels, factor: number): StandardLevels =>
  levels.map((value) => Math.round(value * factor)) as StandardLevels

// Charge externe seule, saisie = charge totale (barre, machine, poulie, un seul haltère)
const single = (levels: StandardLevels): StrengthStandard => ({
  kind: 'load',
  levels,
  handMultiplier: 1,
  bodyweightShare: 0,
})

// Deux haltères : les seuils sources sont par haltère, le total compte les deux
const pair = (perDumbbell: StandardLevels): StrengthStandard => ({
  kind: 'load',
  levels: scale(perDumbbell, 2),
  handMultiplier: 2,
  bodyweightShare: 0,
})

// Exercices avec poids de corps : seuils exprimés en charge totale (poids de corps inclus)
const withBodyweight = (totalLevels: StandardLevels, bodyweightShare = 1): StrengthStandard => ({
  kind: 'load',
  levels: totalLevels,
  handMultiplier: 1,
  bodyweightShare,
})

// Seuils en répétitions convertis en 1RM totale via Epley sur la part de poids de corps déplacée
const withBodyweightFromReps = (reps: StandardLevels, bodyweightShare: number): StrengthStandard =>
  withBodyweight(
    reps.map((count) =>
      Math.round(bodyweightShare * REFERENCE_BODY_WEIGHT_KG * (1 + count / 30)),
    ) as StandardLevels,
    bodyweightShare,
  )

const reps = (levels: StandardLevels): StrengthStandard => ({ kind: 'reps', levels, unit: 'reps' })
const seconds = (levels: StandardLevels): StrengthStandard => ({
  kind: 'reps',
  levels,
  unit: 'seconds',
})

export const STRENGTH_STANDARDS: Record<string, StrengthStandard> = {
  // Jambes
  'squat-barre-libre': single([75, 101, 132, 168, 206]),
  'presse-a-cuisses': single([109, 162, 230, 309, 395]),
  'leg-extension': single([48, 72, 103, 140, 180]),
  'solevele-terre-roumain': single([65, 92, 125, 163, 203]),
  'leg-curl-allonge': single([30, 46, 66, 90, 116]),
  'hip-thrust-barre': single([56, 96, 149, 213, 285]),
  'mollets-debout': single(scale([31, 57, 93, 138, 188], 1.3)), // estimation : mollets assis × 1,3
  'squat-gobelet': single([15, 26, 41, 59, 80]),
  'squat-avant-barre': single([59, 79, 104, 133, 163]),
  'fentes-halteres': pair([10, 18, 30, 45, 62]),
  'fentes-bulgares': pair([9, 16, 27, 40, 56]), // estimation : fente haltères × 0,9
  'squat-hack-machine': single([63, 102, 152, 213, 280]),
  'step-up-banc': pair([9, 15, 26, 38, 53]), // estimation : fente haltères × 0,85
  'squat-poids-du-corps': reps([3, 23, 53, 88, 128]),
  'squat-sumo-haltere': single([18, 31, 49, 71, 96]), // estimation : squat gobelet × 1,2
  'chaise-murale': seconds([15, 45, 90, 140, 200]), // estimation
  'squat-smith-machine': single([57, 84, 118, 158, 202]),
  'fente-arriere-halteres': pair([10, 18, 30, 45, 62]),
  'souleve-terre-jambes-tendues': single([65, 92, 125, 163, 203]), // estimation : = soulevé roumain
  'leg-curl-assis-machine': single([39, 58, 83, 112, 144]),
  'good-morning-barre': single([30, 53, 84, 122, 165]),
  'pont-fessier-halteres': single(scale([56, 96, 149, 213, 285], 0.75)), // estimation : hip thrust × 0,75
  'mollets-assis-machine': single([31, 57, 93, 138, 188]),
  'kick-back-poulie': single([14, 24, 37, 53, 71]), // estimation : hip thrust × 0,25
  'leg-curl-debout-poulie': single([30, 46, 66, 90, 116]), // estimation : = leg curl allongé
  'souleve-terre-unilateral-haltere': single([16, 33, 57, 88, 124]),
  'souleve-terre-classique-barre': single([89, 119, 155, 196, 239]),
  'souleve-terre-trap-bar': single([99, 130, 166, 207, 251]),

  // Dos
  'tractions-supination': withBodyweight([80, 96, 114, 134, 155]),
  'tractions-pronation': withBodyweight([78, 94, 113, 134, 155]),
  'rowing-poulie-basse': single([47, 65, 87, 112, 140]),
  'rowing-barre': single([48, 66, 88, 114, 141]),
  'tirage-vertical-poulie': single([47, 64, 85, 108, 133]),
  'tirage-horizontal-machine': single([47, 65, 87, 112, 140]), // estimation : = rowing poulie basse
  'rowing-halteres-un-bras': single([19, 30, 43, 59, 76]),
  'rowing-t-bar': single([38, 58, 82, 111, 143]),
  'pullover-halteres': single([15, 24, 35, 49, 65]),
  'extension-lombaires-banc': reps([5, 15, 29, 46, 63]),
  'tirage-prise-large-poulie': single(scale([47, 64, 85, 108, 133], 0.95)), // estimation : tirage vertical × 0,95
  'tirage-prise-serree-poulie': single([47, 64, 85, 108, 133]), // estimation : = tirage vertical

  // Pectoraux
  'developpe-incline-halteres': pair([17, 25, 36, 47, 60]), // estimation : développé couché haltères × 0,89
  'developpe-couche-barre': single([56, 75, 98, 124, 151]),
  'dips-lestes': withBodyweight([85, 106, 132, 161, 191]),
  'developpe-couche-halteres': pair([19, 28, 40, 53, 68]),
  'developpe-incline-barre': single([50, 66, 87, 109, 134]),
  'ecarte-couche-halteres': pair([15, 24, 35, 48, 63]),
  'ecarte-poulie-vis-a-vis': single([19, 36, 58, 84, 130]),
  pompes: withBodyweightFromReps([6, 20, 38, 60, 84], 0.64),
  'developpe-decline-barre': single([58, 79, 104, 133, 164]),
  'butterfly-machine': single([42, 63, 89, 119, 152]),
  'dips-poids-du-corps': withBodyweight([85, 106, 132, 161, 191]),
  'presse-pectoraux-machine': single(scale([56, 75, 98, 124, 151], 0.95)), // estimation : développé couché × 0,95
  'pompes-lestees': withBodyweightFromReps([6, 20, 38, 60, 84], 0.64),
  'developpe-couche-prise-serree-barre': single([55, 72, 93, 116, 140]),

  // Épaules
  'elevations-laterales': pair([5, 10, 16, 25, 34]),
  'developpe-militaire-barre': single([33, 46, 62, 81, 101]),
  'face-pull-poulie': single([15, 29, 47, 69, 95]),
  'developpe-militaire-halteres': pair([15, 22, 31, 42, 54]),
  'elevations-frontales-halteres': pair([4, 10, 17, 27, 38]),
  'oiseau-halteres': pair([4, 8, 13, 20, 27]), // estimation : élévations latérales × 0,8
  'rowing-menton-barre': single([23, 39, 59, 84, 111]),
  'arnold-press-halteres': pair([10, 16, 24, 34, 44]),
  'elevations-laterales-poulie': single([3, 8, 16, 27, 39]),
  'shrug-halteres': pair([17, 28, 44, 63, 84]),
  'developpe-militaire-machine': single([29, 50, 76, 109, 145]),
  'elevations-laterales-machine': single([4, 11, 22, 38, 55]), // estimation : élévations poulie × 1,4
  'handstand-pushup-mur': reps([1, 3, 11, 21, 32]),

  // Bras
  'curl-barre': single([22, 33, 46, 63, 80]),
  'extension-triceps-poulie': single([22, 36, 56, 80, 107]),
  'curl-halteres-alterne': pair([8, 14, 22, 32, 42]),
  'curl-marteau-halteres': pair([11, 16, 24, 33, 42]),
  'curl-pupitre-barre': single([20, 31, 45, 61, 78]),
  'curl-poulie-basse': single([20, 33, 51, 73, 98]),
  'extension-triceps-nuque-halteres': single([6, 12, 22, 33, 47]),
  'barre-au-front': single([20, 30, 43, 59, 76]),
  'dips-triceps-banc': reps([8, 22, 40, 60, 85]), // estimation
  'kickback-triceps-halteres': single([3, 7, 12, 18, 25]), // estimation
  'curl-concentration-haltere': single([7, 13, 20, 29, 38]), // estimation : curl haltères × 0,9
  'extension-triceps-corde-poulie': single([22, 36, 56, 80, 107]),
  'extension-triceps-unilaterale-haltere': single([5, 10, 17, 26, 36]), // estimation
  'curl-inverse-barre': single([14, 21, 30, 41, 52]), // estimation : curl barre × 0,65

  // Abdominaux
  planche: seconds([12, 39, 76, 117, 161]),
  'crunch-leste': single([26, 44, 68, 97, 130]),
  'releve-jambes-suspendu-barre': reps([1, 9, 17, 28, 39]),
  'crunch-poids-du-corps': reps([8, 30, 60, 95, 135]), // estimation
  'russian-twist-haltere': single([6, 12, 20, 30, 42]), // estimation
  'gainage-lateral': seconds([8, 24, 46, 70, 97]), // estimation : planche × 0,6
  'roulette-abdominale': reps([1, 8, 21, 37, 55]),
  'mountain-climber': reps([20, 50, 90, 140, 200]), // estimation
  'crunch-poulie-haute': single([26, 44, 68, 97, 130]),
  'releve-bassin-sol': reps([8, 25, 50, 80, 115]), // estimation
  'abdos-velo-sol': reps([20, 50, 90, 140, 200]), // estimation
  'hollow-body-hold': seconds([10, 25, 45, 70, 100]), // estimation
}

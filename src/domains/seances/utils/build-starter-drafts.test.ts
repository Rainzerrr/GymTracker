import { describe, expect, it } from 'vitest'
import { STARTER_PROGRAM } from '../data/starter-programs'
import { getLibraryExercise } from '../hooks/use-exercise-library'
import { parseRestSeconds } from './parse-rest-seconds'
import { parseSetCount } from './parse-set-count'
import { buildStarterDrafts } from './build-starter-drafts'

describe('programme de départ', () => {
  it('ne référence que des exercices de la bibliothèque', () => {
    const unknownIds = STARTER_PROGRAM.sessions
      .flatMap((session) => session.exercises)
      .map((exercise) => exercise.libraryExerciseId)
      .filter((id) => !getLibraryExercise(id))

    expect(unknownIds).toEqual([])
  })

  it('place chaque séance sur un jour de la semaine, une seule fois', () => {
    const placed = STARTER_PROGRAM.weekLayout.filter((index) => index !== null)

    expect(STARTER_PROGRAM.weekLayout).toHaveLength(7)
    expect([...placed].sort()).toEqual(STARTER_PROGRAM.sessions.map((_s, index) => index))
  })

  it('produit des séances complètes et lisibles par la séance active', () => {
    const drafts = buildStarterDrafts(STARTER_PROGRAM, getLibraryExercise)

    expect(drafts).toHaveLength(STARTER_PROGRAM.sessions.length)
    drafts.forEach((draft) => {
      expect(draft.exercises).toHaveLength(4)
      draft.exercises.forEach((exercise) => {
        expect(parseSetCount(exercise.targetLabel)).toBe(3)
        expect(parseRestSeconds(exercise.restLabel)).toBe(90)
      })
    })
  })

  it('donne un identifiant unique à chaque exercice', () => {
    const drafts = buildStarterDrafts(STARTER_PROGRAM, getLibraryExercise)
    const ids = drafts.flatMap((draft) => draft.exercises.map((exercise) => exercise.id))

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ignore un exercice inconnu au lieu de casser le programme', () => {
    const drafts = buildStarterDrafts(STARTER_PROGRAM, (id) =>
      id === 'rowing-barre' ? undefined : getLibraryExercise(id),
    )

    expect(drafts[1].exercises.map((exercise) => exercise.libraryExerciseId)).not.toContain(
      'rowing-barre',
    )
  })
})

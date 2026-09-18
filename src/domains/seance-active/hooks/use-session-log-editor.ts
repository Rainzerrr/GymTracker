import { useState } from 'react'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { isBodyweightEquipment } from '@domains/seances/utils/is-bodyweight-equipment'
import { parseSetCount } from '@domains/seances/utils/parse-set-count'
import { useSessionLog } from './use-session-log'
import { buildLoggedExercises } from '../utils/build-logged-exercises'

const ESTIMATED_MINUTES_PER_EXERCISE = 12

type EditableSet = { weight: number; reps: number }

export const useSessionLogEditor = (sessionId: string | undefined, dateIso: string | undefined) => {
  const { getSession } = useSessions()
  const { getEntryForDate, upsertSessionLogForDate } = useSessionLog()

  const session = sessionId ? getSession(sessionId) : undefined
  const date = dateIso ? new Date(dateIso) : new Date()
  const existingEntry = getEntryForDate(date)

  const exerciseTemplates = (session?.exercises ?? []).map((exercise) => {
    const libraryExercise = getLibraryExercise(exercise.libraryExerciseId)
    const setCount = parseSetCount(exercise.targetLabel)
    const isBodyweight = libraryExercise ? isBodyweightEquipment(libraryExercise.equipment) : false
    const loggedSets = existingEntry?.exercises.find(
      (loggedExercise) => loggedExercise.libraryExerciseId === exercise.libraryExerciseId,
    )?.sets

    return {
      libraryExerciseId: exercise.libraryExerciseId,
      name: exercise.name,
      thumbnailUrl: exercise.thumbnailUrl,
      muscleGroup: libraryExercise?.muscleGroup,
      isBodyweight,
      initialSets: Array.from({ length: setCount }, (_unused, index): EditableSet => ({
        weight: loggedSets?.[index]?.weight ?? 0,
        reps: loggedSets?.[index]?.reps ?? 0,
      })),
    }
  })

  const [setsByExercise, setSetsByExercise] = useState<EditableSet[][]>(() =>
    exerciseTemplates.map((exercise) => exercise.initialSets),
  )

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof EditableSet, value: number) => {
    setSetsByExercise((current) =>
      current.map((sets, index) =>
        index === exerciseIndex
          ? sets.map((set, setPosition) => (setPosition === setIndex ? { ...set, [field]: value } : set))
          : sets,
      ),
    )
  }

  const save = () => {
    if (!session) {
      return
    }

    const finalSetsByExercise = setsByExercise.map((sets) => sets.map((set) => ({ ...set, rir: null })))
    const loggedExercises = buildLoggedExercises(exerciseTemplates, finalSetsByExercise)

    upsertSessionLogForDate(date, {
      sessionName: session.name,
      imageUrl: session.imageUrl,
      durationMinutes: Math.max(1, session.exercises.length * ESTIMATED_MINUTES_PER_EXERCISE),
      exercises: loggedExercises,
    })
  }

  return {
    session,
    exercises: exerciseTemplates.map((exercise, index) => ({
      ...exercise,
      sets: setsByExercise[index],
    })),
    updateSet,
    save,
  }
}

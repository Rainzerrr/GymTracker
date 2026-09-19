import { useState } from 'react'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { isBodyweightEquipment } from '@domains/seances/utils/is-bodyweight-equipment'
import { estimateSessionMinutes } from '@domains/seances/utils/estimate-session-duration'
import { parseRestSeconds } from '@domains/seances/utils/parse-rest-seconds'
import { parseSetCount } from '@domains/seances/utils/parse-set-count'
import { useSessionLog } from './use-session-log'
import { buildLoggedExercises } from '../utils/build-logged-exercises'

type EditableSet = { weight: number; reps: number }

export const useSessionLogEditor = (sessionId: string | undefined, dateIso: string | undefined) => {
  const { getSession } = useSessions()
  const { getEntryForDate, upsertSessionLogForDate } = useSessionLog()

  const session = sessionId ? getSession(sessionId) : undefined
  const parsedDate = dateIso ? new Date(dateIso) : new Date()
  const date = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate
  const existingEntry = getEntryForDate(date)

  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)
  const isFutureDate = date.getTime() > todayMidnight.getTime()

  const exerciseTemplates = (session?.exercises ?? []).map((exercise) => {
    const libraryExercise = getLibraryExercise(exercise.libraryExerciseId)
    const setCount = parseSetCount(exercise.targetLabel)
    const isBodyweight = libraryExercise ? isBodyweightEquipment(libraryExercise.equipment) : false
    const loggedExercise = existingEntry?.exercises.find(
      (candidate) => candidate.libraryExerciseId === exercise.libraryExerciseId,
    )
    const loggedSets = loggedExercise?.sets

    return {
      libraryExerciseId: exercise.libraryExerciseId,
      name: exercise.name,
      thumbnailUrl: exercise.thumbnailUrl,
      muscleGroup: libraryExercise?.muscleGroup,
      // L'édition ne touche pas aux notes saisies pendant la séance.
      note: loggedExercise?.note,
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

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof EditableSet,
    value: number,
  ) => {
    setSetsByExercise((current) =>
      current.map((sets, index) =>
        index === exerciseIndex
          ? sets.map((set, setPosition) =>
              setPosition === setIndex ? { ...set, [field]: value } : set,
            )
          : sets,
      ),
    )
  }

  const save = () => {
    if (!session || isFutureDate) {
      return
    }

    const finalSetsByExercise = setsByExercise.map((sets) =>
      sets.map((set) => ({ ...set, rir: null })),
    )
    const loggedExercises = buildLoggedExercises(exerciseTemplates, finalSetsByExercise)

    upsertSessionLogForDate(date, {
      sessionName: session.name,
      imageUrl: session.imageUrl,
      durationMinutes: estimateSessionMinutes(
        session.exercises.map((exercise) => ({
          setCount: parseSetCount(exercise.targetLabel),
          restSeconds: parseRestSeconds(exercise.restLabel),
        })),
      ),
      exercises: loggedExercises,
    })
  }

  return {
    session,
    isFutureDate,
    exercises: exerciseTemplates.map((exercise, index) => ({
      ...exercise,
      sets: setsByExercise[index],
    })),
    updateSet,
    save,
  }
}

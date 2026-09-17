import { useMemo, useState } from 'react'
import exerciseLibraryData from '../data/exercise-library.json'
import type { LibraryExercise } from '../types/library-exercise'
import type { MuscleGroup } from '../types/muscle-group'

const library = exerciseLibraryData as LibraryExercise[]

export const useExerciseLibrary = () => {
  const [search, setSearch] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | 'all'>('all')

  const results = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return library.filter((exercise) => {
      const matchesGroup = muscleGroup === 'all' || exercise.muscleGroup === muscleGroup
      const matchesSearch = normalizedSearch === '' || exercise.name.toLowerCase().includes(normalizedSearch)

      return matchesGroup && matchesSearch
    })
  }, [search, muscleGroup])

  return { totalCount: library.length, results, search, setSearch, muscleGroup, setMuscleGroup }
}

export const getLibraryExercise = (id: string): LibraryExercise | undefined =>
  library.find((exercise) => exercise.id === id)

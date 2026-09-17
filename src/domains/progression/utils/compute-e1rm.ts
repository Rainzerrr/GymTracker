export const computeE1rm = (weightKg: number, reps: number): number => {
  if (weightKg <= 0) {
    return reps
  }

  return weightKg * (1 + reps / 30)
}

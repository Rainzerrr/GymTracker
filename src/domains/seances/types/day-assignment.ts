export type DayAssignmentValue = 'rest' | 'free' | string

export type WeekPlan = Record<number, DayAssignmentValue>

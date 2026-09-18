export type SessionFocus = 'push' | 'pull' | 'upper' | 'lower' | 'full-body'

export const SESSION_FOCUS_LABELS: Record<SessionFocus, string> = {
  push: 'Push',
  pull: 'Pull',
  upper: 'Upper',
  lower: 'Lower',
  'full-body': 'Full Body',
}

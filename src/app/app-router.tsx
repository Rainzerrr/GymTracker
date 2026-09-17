import { HomePage } from '@domains/home/pages/home-page'
import { ProfilPage } from '@domains/profil/pages/profil-page'
import { ProgressionPage } from '@domains/progression/pages/progression-page'
import { ActiveSessionPage } from '@domains/seance-active/pages/active-session-page'
import { SessionRecapPage } from '@domains/seance-active/pages/session-recap-page'
import { ExerciseConfigPage } from '@domains/seances/pages/exercise-config-page'
import { ExercisePickerPage } from '@domains/seances/pages/exercise-picker-page'
import { SeancesPage } from '@domains/seances/pages/seances-page'
import { SessionBuilderPage } from '@domains/seances/pages/session-builder-page'
import { WeekPlanPage } from '@domains/seances/pages/week-plan-page'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/app-layout'

export const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/seances', element: <SeancesPage /> },
      { path: '/progression', element: <ProgressionPage /> },
      { path: '/profil', element: <ProfilPage /> },
    ],
  },
  { path: '/seances/planning', element: <WeekPlanPage /> },
  { path: '/seances/exercices', element: <ExercisePickerPage /> },
  { path: '/seances/exercices/:libraryExerciseId/configurer', element: <ExerciseConfigPage /> },
  { path: '/seances/:sessionId', element: <SessionBuilderPage /> },
  { path: '/seance-active/:sessionId', element: <ActiveSessionPage /> },
  { path: '/seance-recap', element: <SessionRecapPage /> },
])

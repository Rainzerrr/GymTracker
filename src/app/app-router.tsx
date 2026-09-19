import { HomePage } from '@domains/home/pages/home-page'
import { ProfilPage } from '@domains/profil/pages/profil-page'
import { ProgressionPage } from '@domains/progression/pages/progression-page'
import { SessionHistoryDetailPage } from '@domains/progression/pages/session-history-detail-page'
import { RankDetailPage } from '@domains/progression/pages/rank-detail-page'
import { RankPage } from '@domains/progression/pages/rank-page'
import { VolumePage } from '@domains/progression/pages/volume-page'
import { ActiveSessionPage } from '@domains/seance-active/pages/active-session-page'
import { SessionLogPage } from '@domains/seance-active/pages/session-log-page'
import { SessionRecapPage } from '@domains/seance-active/pages/session-recap-page'
import { ExerciseConfigPage } from '@domains/seances/pages/exercise-config-page'
import { ExercisePickerPage } from '@domains/seances/pages/exercise-picker-page'
import { SeancesPage } from '@domains/seances/pages/seances-page'
import { SessionBuilderPage } from '@domains/seances/pages/session-builder-page'
import { WeekPlanPage } from '@domains/seances/pages/week-plan-page'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/app-layout'
import { RootLayout } from './layout/root-layout'

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/seances', element: <SeancesPage /> },
          { path: '/progression', element: <ProgressionPage /> },
          { path: '/profil', element: <ProfilPage /> },
        ],
      },
      { path: '/progression/volume', element: <VolumePage /> },
      { path: '/progression/seances/:entryId', element: <SessionHistoryDetailPage /> },
      { path: '/progression/rangs', element: <RankPage /> },
      { path: '/progression/rangs/:category/:itemId', element: <RankDetailPage /> },
      { path: '/seances/planning', element: <WeekPlanPage /> },
      { path: '/seances/exercices', element: <ExercisePickerPage /> },
      { path: '/seances/exercices/:libraryExerciseId/configurer', element: <ExerciseConfigPage /> },
      { path: '/seances/:sessionId', element: <SessionBuilderPage /> },
      { path: '/seance-active/:sessionId', element: <ActiveSessionPage /> },
      { path: '/seance-log/:sessionId', element: <SessionLogPage /> },
      { path: '/seance-recap', element: <SessionRecapPage /> },
    ],
  },
])

import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useThemeSync } from '@domains/reglages/hooks/use-theme-sync'
import { appRouter } from './app-router'
import { AppSplash } from './splash/app-splash'

export const App = () => {
  const [showSplash, setShowSplash] = useState(true)

  useThemeSync()

  return (
    <>
      <RouterProvider router={appRouter} />
      {showSplash && <AppSplash onFinish={() => setShowSplash(false)} />}
    </>
  )
}

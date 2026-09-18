import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from './app-router'
import { AppSplash } from './splash/app-splash'

export const App = () => {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      <RouterProvider router={appRouter} />
      {showSplash && <AppSplash onFinish={() => setShowSplash(false)} />}
    </>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-600.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@app/i18n-resources'
import '@shared/styles/main.scss'
import { App } from '@app/app'
import { readAppSettings } from '@domains/reglages/hooks/use-app-settings'
import { applyTheme } from '@shared/utils/theme/apply-theme'

// Dev-only: `?demo` fills the app with sample training data, `?demo=restore` undoes it.
const loadDemoDataIfRequested = async () => {
  if (!import.meta.env.DEV) {
    return
  }

  const demo = new URLSearchParams(window.location.search).get('demo')

  if (demo === null) {
    return
  }

  const { restoreDemoBackup, seedDemoData } = await import('@app/demo-data')

  if (demo === 'restore') {
    restoreDemoBackup()
  } else {
    seedDemoData()
  }

  window.history.replaceState(null, '', window.location.pathname)
}

// Applique le thème avant le premier rendu pour éviter un flash de la mauvaise couleur.
applyTheme(readAppSettings().theme)

void loadDemoDataIfRequested().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

import { useEffect } from 'react'
import { applyTheme } from '@shared/utils/theme/apply-theme'
import { useAppSettings } from './use-app-settings'

// Applique le thème choisi, et suit le système tant que le choix est « auto ».
export const useThemeSync = () => {
  const { settings } = useAppSettings()
  const { theme } = settings

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'auto') return undefined

    const query = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = () => applyTheme('auto')

    query.addEventListener('change', handleChange)

    return () => query.removeEventListener('change', handleChange)
  }, [theme])
}

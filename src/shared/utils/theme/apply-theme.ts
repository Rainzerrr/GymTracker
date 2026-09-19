export type ThemePreference = 'auto' | 'light' | 'dark'

const THEME_COLORS = { dark: '#0e0e10', light: '#f6f4ef' }

const systemPrefersLight = () => window.matchMedia('(prefers-color-scheme: light)').matches

// « auto » retire l'attribut et laisse la feuille de style suivre le système.
export const applyTheme = (preference: ThemePreference) => {
  const root = document.documentElement

  if (preference === 'auto') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', preference)
  }

  const effectiveTheme =
    preference === 'auto' ? (systemPrefersLight() ? 'light' : 'dark') : preference

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[effectiveTheme])
}

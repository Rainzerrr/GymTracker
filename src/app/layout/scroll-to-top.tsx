import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    // Some containers (the tab layout) outlive route changes, so reset them all.
    document.querySelectorAll('[data-scroll-container]').forEach((container) => container.scrollTo(0, 0))
  }, [pathname])

  return null
}

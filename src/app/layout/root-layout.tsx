import { Outlet } from 'react-router-dom'
import { ScrollToTop } from './scroll-to-top'

export const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
)

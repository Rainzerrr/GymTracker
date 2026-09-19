import { Outlet } from 'react-router-dom'
import { ScrollToTop } from './scroll-to-top'
import './root-layout.scss'

export const RootLayout = () => (
  <div className="root-layout" data-scroll-container>
    <ScrollToTop />
    <Outlet />
  </div>
)

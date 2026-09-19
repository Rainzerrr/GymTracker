import { Outlet } from 'react-router-dom'
import { useOnboardingAutoLaunch } from '@domains/onboarding/hooks/use-onboarding-auto-launch'
import { ScrollToTop } from './scroll-to-top'
import './root-layout.scss'

export const RootLayout = () => {
  useOnboardingAutoLaunch()

  return (
    <div className="root-layout" data-scroll-container>
      <ScrollToTop />
      <Outlet />
    </div>
  )
}

import { useEffect, useState } from 'react'
import './app-splash.scss'

const EXIT_DELAY_MS = 2000
const FINISH_DELAY_MS = 2380

type AppSplashProps = {
  onFinish: () => void
}

export const AppSplash = ({ onFinish }: AppSplashProps) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), EXIT_DELAY_MS)
    const finishTimer = setTimeout(onFinish, FINISH_DELAY_MS)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div role="presentation" className={`app-splash ${isExiting ? 'app-splash--exiting' : ''}`}>
      <svg className="app-splash__mark" viewBox="0 0 512 512" aria-hidden="true">
        <rect className="app-splash__plate app-splash__plate--left" x="90" y="156" width="56" height="200" rx="20" />
        <rect className="app-splash__collar app-splash__collar--left" x="150" y="196" width="24" height="120" rx="10" />
        <rect className="app-splash__bar-shape" x="174" y="236" width="164" height="40" rx="10" />
        <rect className="app-splash__collar app-splash__collar--right" x="338" y="196" width="24" height="120" rx="10" />
        <rect className="app-splash__plate app-splash__plate--right" x="366" y="156" width="56" height="200" rx="20" />
      </svg>
      <p className="app-splash__wordmark">GymTracker</p>
      <p className="app-splash__tagline">Charge. Progresse. Répète.</p>
      <div className="app-splash__progress">
        <span className="app-splash__progress-fill" />
      </div>
    </div>
  )
}

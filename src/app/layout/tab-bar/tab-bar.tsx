import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import './tab-bar.scss'

type TabDefinition = {
  to: string
  labelKey: string
  icon: ReactNode
}

const tabs: TabDefinition[] = [
  {
    to: '/',
    labelKey: 'navigation.home',
    icon: (
      <>
        <path d="M4 11l8-7 8 7" />
        <path d="M6 10v9h12v-9" />
      </>
    ),
  },
  {
    to: '/seances',
    labelKey: 'navigation.workouts',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18" />
      </>
    ),
  },
  {
    to: '/progression',
    labelKey: 'navigation.progress',
    icon: (
      <>
        <path d="M4 19V10M12 19V4M20 19v-6" />
      </>
    ),
  },
  {
    to: '/profil',
    labelKey: 'navigation.profile',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
]

export const TabBar = () => {
  const { t } = useTranslation('common')

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `tab-bar__tab ${isActive ? 'tab-bar__tab--active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            {tab.icon}
          </svg>
          <span>{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}

import { Outlet } from 'react-router-dom'
import { TabBar } from './tab-bar'
import './app-layout.scss'

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <div className="app-layout__content">
        <Outlet />
      </div>
      <TabBar />
    </div>
  )
}

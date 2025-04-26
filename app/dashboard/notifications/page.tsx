import type { Metadata } from 'next'
import { NotificationsScreen } from './components/notifications-screen'
import { UserProvider } from '@/context/UserContext'
import { DashboardHeader } from '../components/dashboard-header'

export const metadata: Metadata = {
  title: 'Notificações | Facilize',
  description: 'Gerencie suas notificações na plataforma Facilize',
}

export default function NotificationsPage() {
  return (
    <UserProvider>
      <DashboardHeader />
      <NotificationsScreen />
    </UserProvider>
  )
}

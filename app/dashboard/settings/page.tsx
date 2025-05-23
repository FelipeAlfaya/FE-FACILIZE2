import { UserProvider } from '@/context/UserContext'
import { DashboardHeader } from '../components/dashboard-header'
import { SettingsTabs } from './components/settings-tabs'

export default function SettingsPage() {
  return (
    <UserProvider>
      <div className='min-h-screen bg-background'>
        <DashboardHeader />
        <main className='container mx-auto px-4 py-6'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold mb-2'>Configurações</h1>
            <p className='text-muted-foreground'>
              Gerencie suas preferências e configurações da conta
            </p>
          </div>

          <SettingsTabs />
        </main>
      </div>
    </UserProvider>
  )
}


'use client'

import { useState } from 'react'
import { TabNavigation } from './tab-navigation'
import { DashboardView } from './dashboard-view'
import { UsersView } from './users-view'
import { DashboardHeader } from '@/app/dashboard/components/dashboard-header'

export type AdminView = 'dashboard' | 'users' | 'settings'

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'users':
        return <UsersView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className='flex flex-col h-screen bg-background'>
      <DashboardHeader />
      <TabNavigation currentView={currentView} onViewChange={setCurrentView} />
      <main className='flex-1 overflow-y-auto p-4 md:p-6'>
        {renderContent()}
      </main>
    </div>
  )
}


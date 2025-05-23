'use client'

import { useState, useEffect } from 'react'
import { TabNavigation } from './tab-navigation'
import { DashboardView } from './dashboard-view'
import { UsersView } from './users-view'
import { DashboardHeader } from '@/app/dashboard/components/dashboard-header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export type AdminView = 'dashboard' | 'users' | 'settings' | 'dev-controller'

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const router = useRouter()

  // Efeito para lidar com navegação quando o currentView mudar para dev-controller
  useEffect(() => {
    if (currentView === 'dev-controller') {
      router.push('/admin/dev-controller')
    }
  }, [currentView, router])

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'users':
        return <UsersView />
      case 'dev-controller':
        // Renderizar um placeholder enquanto navega
        return (
          <div>Redirecionando para o Controlador de Desenvolvimento...</div>
        )
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

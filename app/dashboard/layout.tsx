'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardGuard from './dashboard-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { token, isInitialized } = useAuth()
  const router = useRouter()

  // Verificar autenticação
  useEffect(() => {
    if (isInitialized && !token) {
      router.push('/login')
    }
  }, [isInitialized, token, router])

  // Se não estiver inicializado, mostra um indicador de carregamento
  if (!isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderiza nada (será redirecionado)
  if (!token) {
    return null
  }

  // Se estiver autenticado, usa o DashboardGuard para proteger o conteúdo
  return <DashboardGuard>{children}</DashboardGuard>
}

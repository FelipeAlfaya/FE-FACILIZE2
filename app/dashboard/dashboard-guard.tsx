'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { isAdmin, isDevRoute } from '@/lib/auth'

/**
 * Componente específico para proteger o dashboard quando marcado como em desenvolvimento
 */
export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [shouldBlock, setShouldBlock] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Verificar se devemos bloquear o acesso ao dashboard
  useEffect(() => {
    const checkDashboardAccess = () => {
      try {
        console.log('[DashboardGuard] Verificando acesso ao dashboard...')

        // Verificar se o dashboard está marcado como em desenvolvimento
        const isDev = isDevRoute('/dashboard')
        console.log('[DashboardGuard] Dashboard em desenvolvimento?', isDev)

        // Verificar se o usuário é admin
        const isUserAdmin = isAdmin()
        console.log('[DashboardGuard] Usuário é admin?', isUserAdmin)
        console.log('[DashboardGuard] Detalhes do usuário:', user)

        // Verificação explícita do localStorage
        const userLocalStorage = localStorage.getItem('user')
        if (userLocalStorage) {
          try {
            const parsedUser = JSON.parse(userLocalStorage)
            console.log(
              `[DashboardGuard] localStorage user.isAdmin:`,
              parsedUser?.isAdmin
            )
          } catch (e) {
            console.error(
              '[DashboardGuard] Erro ao parsear user do localStorage'
            )
          }
        }

        // Deve bloquear se estiver em desenvolvimento e não for admin
        const blockAccess = isDev && !isUserAdmin
        console.log('[DashboardGuard] Bloquear acesso?', blockAccess)

        setShouldBlock(blockAccess)
      } catch (error) {
        console.error('[DashboardGuard] Erro:', error)
      } finally {
        setIsChecking(false)
      }
    }

    // Verificar imediatamente
    checkDashboardAccess()

    // E também após um breve atraso para garantir que tudo está inicializado
    const timers = [
      setTimeout(checkDashboardAccess, 500),
      setTimeout(checkDashboardAccess, 1500),
    ]

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [user, pathname])

  // Enquanto verifica, não mostra nada
  if (isChecking) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Se não deve bloquear, renderiza o conteúdo normalmente
  if (!shouldBlock) {
    return <>{children}</>
  }

  // Se deve bloquear, mostra o overlay de acesso negado
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <Card className='max-w-md w-full shadow-lg border-2 border-yellow-500'>
        <CardHeader className='bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-900/50'>
          <div className='flex items-center gap-3 text-yellow-700 dark:text-yellow-400'>
            <AlertTriangle className='h-6 w-6' />
            <CardTitle>Acesso Restrito ao Dashboard</CardTitle>
          </div>
          <CardDescription className='text-yellow-700/70 dark:text-yellow-400/70'>
            O Dashboard está atualmente em desenvolvimento e só pode ser
            acessado por administradores.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6 flex flex-col gap-4'>
          <p className='text-muted-foreground'>
            As funcionalidades do Dashboard estão sendo atualizadas. Se você é
            um administrador, por favor faça login com suas credenciais para
            acessar esta seção.
          </p>

          <div className='flex flex-col sm:flex-row gap-2 mt-2'>
            <Button
              className='flex-1 gap-2'
              variant='default'
              onClick={() => router.back()}
            >
              <ArrowLeft className='h-4 w-4' /> Voltar
            </Button>
            <Button
              className='flex-1 gap-2'
              variant='outline'
              onClick={() => {
                logout()
                router.push('/login')
              }}
            >
              <LogOut className='h-4 w-4' /> Fazer Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

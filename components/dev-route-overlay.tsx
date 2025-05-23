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
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  isAdmin,
  isDevRoute,
  shouldBlockRoute,
  syncAuthCookies,
} from '@/lib/auth'

export const DevRouteOverlay = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, token } = useAuth()
  const [shouldBlock, setShouldBlock] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [checkCount, setCheckCount] = useState(0)

  // Verificar se devemos bloquear esta rota, executando mais cedo no ciclo de vida do componente
  useEffect(() => {
    console.log(`[DevOverlay] Verificando rota: ${pathname}, Usuário:`, user)

    // Função que verifica a rota atual
    const checkRoute = () => {
      setIsChecking(true)
      try {
        // Sincronizar cookies
        syncAuthCookies()

        // Verificações especiais para rotas críticas como o dashboard
        const isDashboardRoute =
          pathname === '/dashboard' || pathname.startsWith('/dashboard/')

        // Verificar se a rota está marcada como desenvolvimento
        const isDevPathname = isDevRoute(pathname)
        console.log(
          `[DevOverlay] Rota ${pathname} é de desenvolvimento? ${isDevPathname}`
        )

        // Verificar status de admin do usuário
        const isAdminUser = isAdmin()
        console.log(`[DevOverlay] Usuário é admin? ${isAdminUser}`)
        console.log(`[DevOverlay] Objeto user:`, user)

        // Verificação explícita do localStorage
        const userLocalStorage = localStorage.getItem('user')
        if (userLocalStorage) {
          try {
            const parsedUser = JSON.parse(userLocalStorage)
            console.log(
              `[DevOverlay] localStorage user.isAdmin:`,
              parsedUser?.isAdmin
            )
          } catch (e) {
            console.error('[DevOverlay] Erro ao parsear user do localStorage')
          }
        }

        // Caso especial para dashboard
        if (isDashboardRoute && isDevPathname) {
          console.log('[DevOverlay] Rota do dashboard em desenvolvimento')
          // Se for a rota do dashboard e estiver marcada como em desenvolvimento
          // verificar explicitamente se é admin
          if (!isAdminUser && user && user.isAdmin !== true) {
            console.log('[DevOverlay] Bloqueando dashboard para não-admin')
            setShouldBlock(true)
            return
          }
        }

        // Verificação geral para todas as rotas
        // Só deve bloquear se for uma rota de desenvolvimento E o usuário não for admin
        const shouldBlockAccess = isDevPathname && !isAdminUser
        console.log(`[DevOverlay] Deve bloquear acesso? ${shouldBlockAccess}`)

        setShouldBlock(shouldBlockAccess)
      } catch (error) {
        console.error(
          '[DevOverlay] Erro ao verificar status de bloqueio:',
          error
        )
      } finally {
        setIsChecking(false)
        setCheckCount((prev) => prev + 1)
      }
    }

    // Verificar imediatamente
    checkRoute()

    // Configurar múltiplas verificações com atrasos diferentes para garantir inicialização
    const timers = [
      setTimeout(() => checkRoute(), 500),
      setTimeout(() => checkRoute(), 1000),
      setTimeout(() => checkRoute(), 2000),
    ]

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [pathname, user, token])

  // Forçar verificação adicional para o dashboard a cada mudança no checkCount
  useEffect(() => {
    if (pathname === '/dashboard' && checkCount > 0 && checkCount < 5) {
      console.log(
        `[DevOverlay] Verificação adicional #${checkCount} para dashboard`
      )
      const timer = setTimeout(() => {
        const isAdminUser = isAdmin()
        const isDevPathname = isDevRoute(pathname)
        setShouldBlock(isDevPathname && !isAdminUser)
      }, 500 * checkCount)

      return () => clearTimeout(timer)
    }
  }, [checkCount, pathname])

  // Se não devemos bloquear (é admin ou não é uma rota em desenvolvimento), retornar nulo
  if (isChecking || !shouldBlock) {
    return null
  }

  // Se chegamos aqui, precisamos bloquear o acesso
  console.log('[DevOverlay] Bloqueando acesso, exibindo overlay')

  return (
    <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <Card className='max-w-md w-full shadow-lg border-2 border-yellow-500'>
        <CardHeader className='bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-900/50'>
          <div className='flex items-center gap-3 text-yellow-700 dark:text-yellow-400'>
            <AlertTriangle className='h-6 w-6' />
            <CardTitle>Acesso Restrito</CardTitle>
          </div>
          <CardDescription className='text-yellow-700/70 dark:text-yellow-400/70'>
            Esta página está em desenvolvimento e só pode ser acessada por
            administradores.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6 flex flex-col gap-4'>
          <p className='text-muted-foreground'>
            Esta funcionalidade ainda está sendo desenvolvida e testada. Se você
            é um administrador, faça login com suas credenciais para acessar
            esta página.
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
              onClick={() => router.push('/login')}
            >
              <Home className='h-4 w-4' /> Fazer Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

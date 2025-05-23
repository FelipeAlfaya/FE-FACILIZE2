'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '../components/dashboard-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  LogIn,
  Construction,
  Clock,
  CheckCircle2,
  Code,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Badge } from '@/components/ui/badge'

// Esta constante deve ser mantida em sincronização com a lista em middleware.ts
const DEV_ROUTES = [
  '/dashboard/tax-calculator',
  '/dashboard/tax-comparison',
  '/dashboard/accounting',
  '/dashboard/chatbot',
]

export default function DevelopmentPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState<string>('')

  useEffect(() => {
    // Capturar o caminho atual para exibição
    setCurrentPath(window.location.pathname)

    // Verificar autenticação
    if (!token) {
      // Adicionar um pequeno atraso para evitar redirecionamento instantâneo
      const redirectTimer = setTimeout(() => {
        router.push('/login')
      }, 3000) // Redirecionar após 3 segundos

      return () => clearTimeout(redirectTimer)
    }

    setLoading(false)
  }, [token, router])

  // Se não estiver autenticado, mostrar mensagem de redirecionamento
  if (!token && !loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Card className='w-[450px] shadow-lg border-yellow-500/30'>
          <CardHeader className='bg-yellow-50/50 dark:bg-yellow-900/10'>
            <div className='flex items-center gap-2 text-yellow-700 dark:text-yellow-400'>
              <AlertTriangle className='h-5 w-5' />
              <CardTitle>Acesso Restrito</CardTitle>
            </div>
            <CardDescription>
              Esta área está em desenvolvimento e requer autenticação.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-4 pb-2'>
            <div className='space-y-4'>
              <p className='text-muted-foreground'>
                Você será redirecionado para a página de login em alguns
                segundos...
              </p>
              <div className='flex justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='border-t pt-4 flex justify-end'>
            <Button
              variant='default'
              size='sm'
              onClick={() => router.push('/login')}
              className='gap-2'
            >
              <LogIn className='h-4 w-4' /> Ir para Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <DashboardHeader />

      <main className='flex flex-1 items-center justify-center px-4 py-6 bg-background'>
        <div className='max-w-3xl w-full space-y-8'>
          <Card className='border-2 border-yellow-500/30'>
            <CardHeader className='bg-yellow-50/50 dark:bg-yellow-900/10 border-b'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Construction className='h-6 w-6 text-yellow-600' />
                  <div>
                    <Badge
                      variant='outline'
                      className='border-yellow-400 text-yellow-700 dark:text-yellow-400 mb-2'
                    >
                      Em Desenvolvimento
                    </Badge>
                    <CardTitle className='text-2xl'>
                      {currentPath.split('/').pop()?.replace(/-/g, ' ')}
                    </CardTitle>
                  </div>
                </div>
                <div>
                  {user?.isAdmin && (
                    <Badge className='bg-blue-500'>Admin</Badge>
                  )}
                </div>
              </div>
              <CardDescription className='mt-2'>
                Esta funcionalidade está em fase de desenvolvimento e será
                disponibilizada em breve
              </CardDescription>
            </CardHeader>

            <CardContent className='pt-6 space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-medium flex items-center gap-2 mb-3'>
                    <CheckCircle2 className='h-5 w-5 text-green-500' />O que
                    estamos construindo
                  </h3>
                  <ul className='space-y-2 text-muted-foreground'>
                    <li className='flex gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500 mt-1 flex-shrink-0' />
                      <span>
                        Funcionalidades modernas e intuitivas para simplificar
                        seu trabalho
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500 mt-1 flex-shrink-0' />
                      <span>
                        Interface otimizada para desktop e dispositivos móveis
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500 mt-1 flex-shrink-0' />
                      <span>
                        Integrações com ferramentas inteligentes de automação
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500 mt-1 flex-shrink-0' />
                      <span>Melhorias contínuas baseadas no seu feedback</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-lg font-medium flex items-center gap-2 mb-3'>
                    <Clock className='h-5 w-5 text-blue-500' />
                    Cronograma Estimado
                  </h3>
                  <div className='space-y-3 text-muted-foreground'>
                    <div>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-medium'>
                          Fase de Desenvolvimento
                        </span>
                        <Badge
                          variant='outline'
                          className='bg-blue-500/10 text-blue-700'
                        >
                          Em Andamento
                        </Badge>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2.5'>
                        <div
                          className='bg-blue-500 h-2.5 rounded-full'
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-medium'>Testes Internos</span>
                        <Badge
                          variant='outline'
                          className='bg-yellow-500/10 text-yellow-700'
                        >
                          Planejado
                        </Badge>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2.5'>
                        <div
                          className='bg-yellow-500 h-2.5 rounded-full'
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-medium'>Lançamento</span>
                        <Badge
                          variant='outline'
                          className='bg-gray-500/10 text-gray-500'
                        >
                          Pendente
                        </Badge>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2.5'>
                        <div
                          className='bg-gray-500 h-2.5 rounded-full'
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {user?.isAdmin && (
                <Card className='bg-muted/50 border-dashed'>
                  <CardHeader className='py-3'>
                    <CardTitle className='text-sm font-medium flex items-center gap-2'>
                      <Code className='h-4 w-4' />
                      Informações para Desenvolvedores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='py-2 text-sm'>
                    <p className='text-muted-foreground mb-2'>
                      Rotas atualmente em desenvolvimento:
                    </p>
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {DEV_ROUTES.map((route) => (
                        <Badge
                          key={route}
                          variant='outline'
                          className='font-mono text-xs'
                        >
                          {route}
                        </Badge>
                      ))}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Para modificar as rotas em desenvolvimento, edite a
                      constante{' '}
                      <code className='bg-background px-1 py-0.5 rounded font-mono'>
                        DEV_ROUTES
                      </code>{' '}
                      no arquivo{' '}
                      <code className='bg-background px-1 py-0.5 rounded font-mono'>
                        middleware.ts
                      </code>
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>

            <CardFooter className='border-t flex justify-between pt-4'>
              <Button
                variant='outline'
                onClick={() => router.back()}
                className='gap-2'
              >
                <ArrowLeft className='h-4 w-4' /> Voltar
              </Button>
              <Button
                variant='default'
                onClick={() => router.push('/dashboard')}
                className='gap-2'
              >
                <Home className='h-4 w-4' /> Ir para Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

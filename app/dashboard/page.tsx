import { DashboardHeader } from './components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { DashboardChart } from './components/dashboard-chart'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2'>Olá, Felipe!</h1>
          <p className='text-muted-foreground'>
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Agendamentos Hoje
              </CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>3</div>
              <p className='text-xs text-muted-foreground mt-1'>
                2 confirmados, 1 pendente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Próximo Agendamento
              </CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>10:00</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Consultoria com João Silva
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Clientes Ativos
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>28</div>
              <p className='text-xs text-muted-foreground mt-1'>
                +3 no último mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Faturamento Mensal
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>R$2.450,00</div>
              <div className='flex items-center text-xs text-green-500 mt-1'>
                <TrendingUp className='h-3 w-3 mr-1' />
                <span>+12% em relação ao mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8'>
          <DashboardChart />

          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                  <Calendar className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>João Silva</p>
                  <p className='text-xs text-muted-foreground'>Hoje, 10:00</p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                  <Calendar className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Maria Oliveira</p>
                  <p className='text-xs text-muted-foreground'>Hoje, 14:30</p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                  <Calendar className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Pedro Santos</p>
                  <p className='text-xs text-muted-foreground'>Amanhã, 09:00</p>
                </div>
              </div>

              <Button variant='ghost' size='sm' className='w-full' asChild>
                <Link href='/dashboard/schedule'>
                  Ver todos
                  <ArrowRight className='ml-1 h-4 w-4' />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4'>
              <Button asChild>
                <Link href='/dashboard/providers'>Encontrar Provedores</Link>
              </Button>
              <Button asChild>
                <Link href='/dashboard/schedule'>Ver Agenda</Link>
              </Button>
              <Button asChild>
                <Link href='/dashboard/profile'>Editar Perfil</Link>
              </Button>
              <Button asChild>
                <Link href='/dashboard/plans'>Gerenciar Plano</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seu Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='font-bold text-lg'>Plano Básico</h3>
                  <p className='text-sm text-muted-foreground'>
                    Renovação em 15 dias
                  </p>
                </div>
                <div className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium'>
                  Ativo
                </div>
              </div>

              <div className='space-y-2 mb-6'>
                <div className='flex justify-between text-sm'>
                  <span>Notas fiscais emitidas</span>
                  <span className='font-medium'>12/20</span>
                </div>
                <div className='w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 rounded-full'
                    style={{ width: '60%' }}
                  ></div>
                </div>

                <div className='flex justify-between text-sm'>
                  <span>Clientes cadastrados</span>
                  <span className='font-medium'>8/10</span>
                </div>
                <div className='w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 rounded-full'
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>

              <Button asChild className='w-full'>
                <Link href='/dashboard/payment'>Fazer Upgrade</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

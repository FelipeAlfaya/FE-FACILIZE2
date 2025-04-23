'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  MessageSquare,
  Plus,
  Settings,
  Users,
  Calculator,
  BarChart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardChart } from './dashboard-chart'

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
        <div className='flex items-center space-x-2'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue='overview'
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
          <TabsTrigger value='analytics'>Análise</TabsTrigger>
          <TabsTrigger value='reports'>Relatórios</TabsTrigger>
          <TabsTrigger value='notifications'>Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Agendamentos
                </CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>12</div>
                <p className='text-xs text-muted-foreground'>
                  +2 desde o último mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Provedores
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>8</div>
                <p className='text-xs text-muted-foreground'>
                  +1 desde o último mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Faturamento
                </CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>R$ 4.200</div>
                <p className='text-xs text-muted-foreground'>
                  +15% desde o último mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Mensagens</CardTitle>
                <MessageSquare className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>24</div>
                <p className='text-xs text-muted-foreground'>
                  +8 desde o último mês
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>
                  Visão geral do seu desempenho no último mês.
                </CardDescription>
              </CardHeader>
              <CardContent className='pl-2'>
                <DashboardChart />
              </CardContent>
            </Card>

            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesse rapidamente as principais funcionalidades.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/schedule'>
                      <Calendar className='h-6 w-6 mb-1' />
                      <span>Agenda</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/providers'>
                      <Users className='h-6 w-6 mb-1' />
                      <span>Provedores</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/invoices'>
                      <FileText className='h-6 w-6 mb-1' />
                      <span>Notas Fiscais</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/plans'>
                      <CreditCard className='h-6 w-6 mb-1' />
                      <span>Planos</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/accounting'>
                      <DollarSign className='h-6 w-6 mb-1' />
                      <span>Contabilidade</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/settings'>
                      <Settings className='h-6 w-6 mb-1' />
                      <span>Configurações</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/financial-reports'>
                      <BarChart className='h-6 w-6 mb-1' />
                      <span>Relatórios</span>
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex flex-col justify-center'
                    asChild
                  >
                    <Link href='/dashboard/tax-calculator'>
                      <Calculator className='h-6 w-6 mb-1' />
                      <span>Calculadora</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
                <CardDescription>
                  Você tem 3 agendamentos para os próximos dias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Consultoria de Marketing
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Amanhã às 10:00 - João Silva
                      </p>
                    </div>
                    <div className='ml-auto font-medium'>R$ 150,00</div>
                  </div>
                  <div className='flex items-center'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Assessoria Financeira
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Quinta-feira às 14:30 - Maria Oliveira
                      </p>
                    </div>
                    <div className='ml-auto font-medium'>R$ 200,00</div>
                  </div>
                  <div className='flex items-center'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Consultoria Jurídica
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Sexta-feira às 09:00 - Carlos Mendes
                      </p>
                    </div>
                    <div className='ml-auto font-medium'>R$ 250,00</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Ver Todos os Agendamentos
                </Button>
              </CardFooter>
            </Card>

            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Atividades recentes na sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Novo agendamento
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        João Silva agendou uma consultoria
                      </p>
                    </div>
                    <div className='ml-auto text-sm text-muted-foreground'>
                      5m atrás
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Pagamento recebido
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Pagamento de R$ 150,00 recebido
                      </p>
                    </div>
                    <div className='ml-auto text-sm text-muted-foreground'>
                      1h atrás
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Novo provedor
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Ana Costa se cadastrou como provedora
                      </p>
                    </div>
                    <div className='ml-auto text-sm text-muted-foreground'>
                      3h atrás
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  <BarChart3 className='mr-2 h-4 w-4' />
                  Ver Todas as Atividades
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='analytics' className='space-y-4'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Análise</CardTitle>
              <CardDescription>
                Análise detalhada do seu desempenho.
              </CardDescription>
            </CardHeader>
            <CardContent className='pl-2'>
              <DashboardChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='reports' className='space-y-4'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Acesse seus relatórios.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      Relatório Mensal
                    </p>
                    <p className='text-sm text-muted-foreground'>Abril 2023</p>
                  </div>
                  <Button variant='outline' size='sm'>
                    <FileText className='mr-2 h-4 w-4' />
                    Download
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      Relatório de Vendas
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Primeiro Trimestre 2023
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    <FileText className='mr-2 h-4 w-4' />
                    Download
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      Relatório de Impostos
                    </p>
                    <p className='text-sm text-muted-foreground'>Anual 2022</p>
                  </div>
                  <Button variant='outline' size='sm'>
                    <FileText className='mr-2 h-4 w-4' />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant='outline' className='w-full' asChild>
                <Link href='/dashboard/financial-reports'>
                  <BarChart className='mr-2 h-4 w-4' />
                  Ver Todos os Relatórios
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='notifications' className='space-y-4'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Gerencie suas notificações.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      Novo agendamento
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      João Silva agendou uma consultoria para amanhã às 10:00
                    </p>
                  </div>
                  <div className='ml-auto text-sm text-muted-foreground'>
                    5m atrás
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      Agendamento confirmado
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Seu agendamento com Maria Oliveira foi confirmado
                    </p>
                  </div>
                  <div className='ml-auto text-sm text-muted-foreground'>
                    1h atrás
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>Lembrete</p>
                    <p className='text-sm text-muted-foreground'>
                      Você tem um agendamento com Carlos Mendes em 30 minutos
                    </p>
                  </div>
                  <div className='ml-auto text-sm text-muted-foreground'>
                    30m atrás
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      Fatura disponível
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Sua fatura do mês de Abril está disponível para pagamento
                    </p>
                  </div>
                  <div className='ml-auto text-sm text-muted-foreground'>
                    2h atrás
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant='outline' className='w-full'>
                Ver Todas as Notificações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatsService } from '@/services/stats-service'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { getToken } from '@/lib/auth'

const appointmentData = [
  { month: 'Jan', agendados: 65, confirmados: 40, cancelados: 10 },
  { month: 'Fev', agendados: 59, confirmados: 45, cancelados: 8 },
  { month: 'Mar', agendados: 80, confirmados: 60, cancelados: 12 },
  { month: 'Abr', agendados: 81, confirmados: 65, cancelados: 10 },
  { month: 'Mai', agendados: 90, confirmados: 70, cancelados: 15 },
  { month: 'Jun', agendados: 103, confirmados: 80, cancelados: 18 },
  { month: 'Jul', agendados: 110, confirmados: 85, cancelados: 20 },
  { month: 'Ago', agendados: 120, confirmados: 90, cancelados: 22 },
  { month: 'Set', agendados: 130, confirmados: 100, cancelados: 25 },
  { month: 'Out', agendados: 140, confirmados: 110, cancelados: 20 },
  { month: 'Nov', agendados: 150, confirmados: 120, cancelados: 18 },
  { month: 'Dez', agendados: 160, confirmados: 130, cancelados: 15 },
]

const revenueData = [
  { month: 'Jan', receita: 1500, despesas: 800 },
  { month: 'Fev', receita: 1800, despesas: 850 },
  { month: 'Mar', receita: 2000, despesas: 900 },
  { month: 'Abr', receita: 2200, despesas: 950 },
  { month: 'Mai', receita: 2400, despesas: 1000 },
  { month: 'Jun', receita: 2600, despesas: 1100 },
  { month: 'Jul', receita: 2800, despesas: 1200 },
  { month: 'Ago', receita: 3000, despesas: 1300 },
  { month: 'Set', receita: 3200, despesas: 1400 },
  { month: 'Out', receita: 3400, despesas: 1500 },
  { month: 'Nov', receita: 3600, despesas: 1600 },
  { month: 'Dez', receita: 3800, despesas: 1700 },
]

const serviceData = [
  { name: 'Consultoria Fiscal', valor: 3500 },
  { name: 'Declaração IR', valor: 2800 },
  { name: 'Contabilidade', valor: 4200 },
  { name: 'Planejamento', valor: 3100 },
  { name: 'Auditoria', valor: 1800 },
]

export function DashboardChart() {
  const [timeRange, setTimeRange] = useState('year')
  const [chartData, setChartData] = useState({
    appointments: [] as {
      month: string
      agendados: number
      confirmados: number
      cancelados: number
    }[],
    revenue: [] as {
      month: string
      receita: number
      despesas: number
    }[],
    services: [] as { name: string; valor: number }[],
  })
  const [stats, setStats] = useState({
    todayAppointments: 0,
    confirmedToday: 0,
    pendingToday: 0,
    nextAppointment: null,
    activeClients: 0,
    monthlyRevenue: 0,
  })
  const { user: authUser } = useAuth()
  const { user: userData } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  const getFilteredData = (data: any[]) => {
    switch (timeRange) {
      case 'week':
        return data.slice(-7)
      case 'month':
        return data.slice(-30)
      case 'quarter':
        return data.slice(-90)
      case 'half':
        return data.slice(-180)
      default:
        return data
    }
  }
  const filteredAppointmentData = getFilteredData(appointmentData)
  const filteredRevenueData = getFilteredData(revenueData)

  const getStats = () => {
    const appointments = getFilteredData(chartData.appointments)
    const revenue = getFilteredData(chartData.revenue)

    return {
      appointments: {
        total: appointments.reduce((sum, item) => sum + item.agendados, 0),
        confirmed: appointments.reduce(
          (sum, item) => sum + item.confirmados,
          0
        ),
        conversionRate: appointments.length
          ? Math.round(
              (appointments.reduce((sum, item) => sum + item.confirmados, 0) /
                appointments.reduce((sum, item) => sum + item.agendados, 0)) *
                100
            )
          : 0,
      },
      revenue: {
        total: revenue.reduce((sum, item) => sum + item.receita, 0),
        expenses: revenue.reduce((sum, item) => sum + item.despesas, 0),
        profit:
          revenue.reduce((sum, item) => sum + item.receita, 0) -
          revenue.reduce((sum, item) => sum + item.despesas, 0),
      },
    }
  }

  useEffect(() => {
    if (!authUser?.id || !userData?.id) return

    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        const today = new Date()
        let startDate = new Date()

        switch (timeRange) {
          case 'week':
            startDate.setDate(today.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(today.getMonth() - 1)
            break
          case 'quarter':
            startDate.setMonth(today.getMonth() - 3)
            break
          case 'half':
            startDate.setMonth(today.getMonth() - 6)
            break
          case 'year':
            startDate.setMonth(today.getMonth() - 12)
            break
        }

        // Reset the time to start of day for startDate and end of day for today
        startDate.setHours(0, 0, 0, 0)
        today.setHours(23, 59, 59, 999)

        const token = await getToken()

        if (!token) {
          return
        }

        // Fetch appointments stats
        const appointmentsResponse =
          await StatsService.getAppointmentCountByRange(
            userData.id,
            startDate,
            today,
            token
          )

        // Fetch revenue stats
        const revenueResponse = await StatsService.getRevenueStats(
          userData.id,
          token,
          startDate,
          today
        )

        // Transform appointments data
        const transformedAppointments = [
          {
            month: new Date().toLocaleString('pt-BR', { month: 'short' }),
            agendados: appointmentsResponse.serviceAppointments.total,
            confirmados: appointmentsResponse.serviceAppointments.confirmed,
            cancelados: appointmentsResponse.serviceAppointments.cancelled,
          },
        ]

        // Transform revenue data
        const transformedRevenue = revenueResponse.breakdown.map((item) => ({
          month: new Date(item.date).toLocaleString('pt-BR', {
            month: 'short',
          }),
          receita: item.amount,
          despesas: 0, // Since API doesn't provide expenses, defaulting to 0
        }))

        setChartData({
          appointments: transformedAppointments,
          revenue: transformedRevenue,
          services: serviceData, // Keep using mock data for services
        })

        // Update stats
        setStats({
          todayAppointments: appointmentsResponse.total,
          confirmedToday: appointmentsResponse.serviceAppointments.confirmed,
          pendingToday:
            appointmentsResponse.serviceAppointments.total -
            appointmentsResponse.serviceAppointments.confirmed,
          nextAppointment: null,
          activeClients: 0,
          monthlyRevenue: revenueResponse.totalRevenue,
        })
      } catch (error) {
        console.error('Error fetching chart data:', error)
        toast({
          title: 'Erro',
          description: 'Falha ao carregar dados do gráfico',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [authUser?.id, userData?.id, timeRange])

  const { loading: userLoading } = useUser()

  if (userLoading || isLoading) {
    return (
      <Card className='col-span-2'>
        <CardContent className='flex items-center justify-center h-96'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <p className='text-sm text-muted-foreground'>Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (userData?.type !== 'PROVIDER') {
    return (
      <Card className='col-span-2'>
        <CardContent className='flex items-center justify-center h-96'>
          <p className='text-sm text-muted-foreground'>
            Esta visualização está disponível apenas para prestadores de
            serviço.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-2'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Análise de desempenho e métricas</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Selecionar período' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='week'>Última semana</SelectItem>
            <SelectItem value='month'>Último mês</SelectItem>
            <SelectItem value='quarter'>Últimos 3 meses</SelectItem>
            <SelectItem value='half'>Últimos 6 meses</SelectItem>
            <SelectItem value='year'>Último ano</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='appointments' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='appointments'>Agendamentos</TabsTrigger>
            <TabsTrigger value='revenue'>Receita</TabsTrigger>
            <TabsTrigger value='services'>Serviços</TabsTrigger>
          </TabsList>

          <TabsContent value='appointments' className='space-y-4'>
            <ChartContainer
              config={{
                agendados: {
                  label: 'Agendados',
                  color: 'hsl(var(--chart-1))',
                },
                confirmados: {
                  label: 'Confirmados',
                  color: 'hsl(var(--chart-2))',
                },
                cancelados: {
                  label: 'Cancelados',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className='h-80 w-full'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={getFilteredData(chartData.appointments)}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-muted'
                  />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type='monotone'
                    dataKey='agendados'
                    stroke='var(--color-agendados)'
                    fill='var(--color-agendados)'
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type='monotone'
                    dataKey='confirmados'
                    stroke='var(--color-confirmados)'
                    fill='var(--color-confirmados)'
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type='monotone'
                    dataKey='cancelados'
                    stroke='var(--color-cancelados)'
                    fill='var(--color-cancelados)'
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className='grid grid-cols-3 gap-4'>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Total Agendados
                </div>
                <div className='text-2xl font-bold'>
                  {getStats().appointments.total}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Total Confirmados
                </div>
                <div className='text-2xl font-bold'>
                  {getStats().appointments.confirmed}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Taxa de Conversão
                </div>
                <div className='text-2xl font-bold'>
                  {getStats().appointments.conversionRate}%
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='revenue' className='space-y-4'>
            <ChartContainer
              config={{
                receita: {
                  label: 'Receita',
                  color: 'hsl(var(--chart-1))',
                },
                despesas: {
                  label: 'Despesas',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className='h-80 w-full'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={getFilteredData(chartData.revenue)}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-muted'
                  />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `R$ ${value}`}
                      />
                    }
                  />
                  <Area
                    type='monotone'
                    dataKey='receita'
                    stroke='var(--color-receita)'
                    fill='var(--color-receita)'
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type='monotone'
                    dataKey='despesas'
                    stroke='var(--color-despesas)'
                    fill='var(--color-despesas)'
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className='grid grid-cols-3 gap-4 w-full'>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Receita Total
                </div>
                <div className='text-2xl font-bold'>
                  R$ {getStats().revenue.total.toLocaleString('pt-BR')}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Despesas Totais
                </div>
                <div className='text-2xl font-bold'>
                  R$ {getStats().revenue.expenses.toLocaleString('pt-BR')}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>Lucro</div>
                <div className='text-2xl font-bold'>
                  R$ {getStats().revenue.profit.toLocaleString('pt-BR')}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='services'>
            <ChartContainer
              config={{
                valor: {
                  label: 'Valor',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className='h-80 w-full'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={serviceData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-muted'
                  />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `R$ ${value}`}
                      />
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey='valor'
                    fill='var(--color-valor)'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

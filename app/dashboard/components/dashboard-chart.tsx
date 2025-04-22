'use client'

import { useState } from 'react'
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

  const getFilteredData = (data: any[]) => {
    if (timeRange === 'quarter') {
      return data.slice(-3)
    } else if (timeRange === 'half') {
      return data.slice(-6)
    } else {
      return data
    }
  }

  const filteredAppointmentData = getFilteredData(appointmentData)
  const filteredRevenueData = getFilteredData(revenueData)

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
                  data={filteredAppointmentData}
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
                  {filteredAppointmentData.reduce(
                    (sum, item) => sum + item.agendados,
                    0
                  )}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Total Confirmados
                </div>
                <div className='text-2xl font-bold'>
                  {filteredAppointmentData.reduce(
                    (sum, item) => sum + item.confirmados,
                    0
                  )}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Taxa de Conversão
                </div>
                <div className='text-2xl font-bold'>
                  {Math.round(
                    (filteredAppointmentData.reduce(
                      (sum, item) => sum + item.confirmados,
                      0
                    ) /
                      filteredAppointmentData.reduce(
                        (sum, item) => sum + item.agendados,
                        0
                      )) *
                      100
                  )}
                  %
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
                  data={filteredRevenueData}
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
            <div className='grid grid-cols-3 gap-4'>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Receita Total
                </div>
                <div className='text-2xl font-bold'>
                  R${' '}
                  {filteredRevenueData
                    .reduce((sum, item) => sum + item.receita, 0)
                    .toLocaleString('pt-BR')}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>
                  Despesas Totais
                </div>
                <div className='text-2xl font-bold'>
                  R${' '}
                  {filteredRevenueData
                    .reduce((sum, item) => sum + item.despesas, 0)
                    .toLocaleString('pt-BR')}
                </div>
              </Card>
              <Card className='p-3'>
                <div className='text-xs text-muted-foreground'>Lucro</div>
                <div className='text-2xl font-bold'>
                  R${' '}
                  {(
                    filteredRevenueData.reduce(
                      (sum, item) => sum + item.receita,
                      0
                    ) -
                    filteredRevenueData.reduce(
                      (sum, item) => sum + item.despesas,
                      0
                    )
                  ).toLocaleString('pt-BR')}
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

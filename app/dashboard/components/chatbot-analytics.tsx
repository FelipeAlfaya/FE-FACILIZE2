'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for analytics
const conversationData = [
  { day: 'Seg', count: 42 },
  { day: 'Ter', count: 56 },
  { day: 'Qua', count: 49 },
  { day: 'Qui', count: 63 },
  { day: 'Sex', count: 58 },
  { day: 'Sáb', count: 37 },
  { day: 'Dom', count: 25 },
]

const serviceUsageData = [
  { name: 'Agendamento', value: 45 },
  { name: 'Verificação de Horários', value: 30 },
  { name: 'Cancelamento', value: 15 },
  { name: 'Outros', value: 10 },
]

const resolutionData = [
  { name: 'Resolvido pelo Bot', value: 75 },
  { name: 'Transferido para Humano', value: 25 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ChatbotAnalytics() {
  const [timeRange, setTimeRange] = useState('week')

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-xl font-bold mb-2'>Análise de Desempenho</h2>
          <p className='text-muted-foreground'>
            Estatísticas e métricas do seu chatbot WhatsApp
          </p>
        </div>
        <div className='mt-4 md:mt-0'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Período' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Hoje</SelectItem>
              <SelectItem value='week'>Última Semana</SelectItem>
              <SelectItem value='month'>Último Mês</SelectItem>
              <SelectItem value='year'>Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total de Conversas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>328</div>
            <p className='text-xs text-green-500 flex items-center mt-1'>
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Taxa de Resolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>75%</div>
            <p className='text-xs text-green-500 flex items-center mt-1'>
              +5% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tempo Médio de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>45s</div>
            <p className='text-xs text-green-500 flex items-center mt-1'>
              -10s em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='conversations' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='conversations'>Conversas</TabsTrigger>
          <TabsTrigger value='services'>Serviços</TabsTrigger>
          <TabsTrigger value='resolution'>Resolução</TabsTrigger>
        </TabsList>

        <TabsContent value='conversations'>
          <Card>
            <CardHeader>
              <CardTitle>Volume de Conversas</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: 'Conversas',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className='h-80'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={conversationData}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      className='stroke-muted'
                    />
                    <XAxis dataKey='day' />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey='count'
                      fill='var(--color-count)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='services'>
          <Card>
            <CardHeader>
              <CardTitle>Uso de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={serviceUsageData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {serviceUsageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='resolution'>
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Resolução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={resolutionData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill='#00C49F' />
                      <Cell fill='#FF8042' />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Principais Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-4'>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>Como agendar uma consulta?</p>
                  <p className='text-sm text-muted-foreground'>
                    42 ocorrências
                  </p>
                </div>
                <div className='text-sm font-medium'>12.8%</div>
              </li>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>Quais horários disponíveis?</p>
                  <p className='text-sm text-muted-foreground'>
                    38 ocorrências
                  </p>
                </div>
                <div className='text-sm font-medium'>11.6%</div>
              </li>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>Como cancelar agendamento?</p>
                  <p className='text-sm text-muted-foreground'>
                    27 ocorrências
                  </p>
                </div>
                <div className='text-sm font-medium'>8.2%</div>
              </li>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>Quais serviços oferecem?</p>
                  <p className='text-sm text-muted-foreground'>
                    24 ocorrências
                  </p>
                </div>
                <div className='text-sm font-medium'>7.3%</div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horários de Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-4'>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>10:00 - 12:00</p>
                  <p className='text-sm text-muted-foreground'>87 conversas</p>
                </div>
                <div className='w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 rounded-full'
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </li>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>14:00 - 16:00</p>
                  <p className='text-sm text-muted-foreground'>76 conversas</p>
                </div>
                <div className='w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 rounded-full'
                    style={{ width: '74%' }}
                  ></div>
                </div>
              </li>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>18:00 - 20:00</p>
                  <p className='text-sm text-muted-foreground'>65 conversas</p>
                </div>
                <div className='w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 rounded-full'
                    style={{ width: '63%' }}
                  ></div>
                </div>
              </li>
              <li className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>08:00 - 10:00</p>
                  <p className='text-sm text-muted-foreground'>52 conversas</p>
                </div>
                <div className='w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 rounded-full'
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

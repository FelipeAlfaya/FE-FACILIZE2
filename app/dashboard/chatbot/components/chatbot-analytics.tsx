'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarIcon,
  Download,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const conversationData = [
  { name: 'Seg', conversas: 24 },
  { name: 'Ter', conversas: 32 },
  { name: 'Qua', conversas: 28 },
  { name: 'Qui', conversas: 35 },
  { name: 'Sex', conversas: 40 },
  { name: 'Sáb', conversas: 22 },
  { name: 'Dom', conversas: 15 },
]

const serviceData = [
  { name: 'Agendamento', valor: 45 },
  { name: 'Verificação', valor: 25 },
  { name: 'FAQ', valor: 20 },
  { name: 'Documentos', valor: 10 },
]

const timeData = [
  { name: '8-10h', valor: 15 },
  { name: '10-12h', valor: 25 },
  { name: '12-14h', valor: 10 },
  { name: '14-16h', valor: 30 },
  { name: '16-18h', valor: 20 },
  { name: '18-20h', valor: 15 },
]

const satisfactionData = [
  { name: 'Muito Satisfeito', valor: 45 },
  { name: 'Satisfeito', valor: 30 },
  { name: 'Neutro', valor: 15 },
  { name: 'Insatisfeito', valor: 7 },
  { name: 'Muito Insatisfeito', valor: 3 },
]

export function ChatbotAnalytics() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d')

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h3 className='text-lg font-medium'>Análises do Chatbot</h3>
          <p className='text-sm text-muted-foreground'>
            Visualize estatísticas e métricas de desempenho do seu chatbot.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-2'>
          <Select
            defaultValue={dateRange}
            onValueChange={(value) => setDateRange(value as any)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Selecione o período' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Últimos 7 dias</SelectItem>
              <SelectItem value='30d'>Últimos 30 dias</SelectItem>
              <SelectItem value='90d'>Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-[240px] justify-start text-left font-normal'
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date
                  ? format(date, 'PPP', { locale: ptBR })
                  : 'Selecione uma data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          <Button variant='outline' size='icon'>
            <Download className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total de Conversas
                </p>
                <h3 className='text-2xl font-bold'>196</h3>
              </div>
              <div className='p-2 bg-primary/10 rounded-md'>
                <MessageSquare className='h-5 w-5 text-primary' />
              </div>
            </div>
            <p className='text-xs text-green-600 mt-2'>
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Usuários Atendidos
                </p>
                <h3 className='text-2xl font-bold'>142</h3>
              </div>
              <div className='p-2 bg-primary/10 rounded-md'>
                <Users className='h-5 w-5 text-primary' />
              </div>
            </div>
            <p className='text-xs text-green-600 mt-2'>
              +8% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Tempo Médio de Resposta
                </p>
                <h3 className='text-2xl font-bold'>1.2s</h3>
              </div>
              <div className='p-2 bg-primary/10 rounded-md'>
                <Clock className='h-5 w-5 text-primary' />
              </div>
            </div>
            <p className='text-xs text-green-600 mt-2'>
              -0.3s em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Taxa de Resolução
                </p>
                <h3 className='text-2xl font-bold'>85%</h3>
              </div>
              <div className='p-2 bg-primary/10 rounded-md'>
                <CheckCircle className='h-5 w-5 text-primary' />
              </div>
            </div>
            <p className='text-xs text-green-600 mt-2'>
              +5% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='conversations' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='conversations'>Conversas</TabsTrigger>
          <TabsTrigger value='services'>Serviços</TabsTrigger>
          <TabsTrigger value='satisfaction'>Satisfação</TabsTrigger>
        </TabsList>

        <TabsContent value='conversations' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Volume de Conversas</CardTitle>
            </CardHeader>
            <CardContent className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={conversationData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='conversas'
                    stroke='#8884d8'
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Horários de Pico</CardTitle>
              </CardHeader>
              <CardContent className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='valor' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Conversas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Duração média da conversa</span>
                    <span className='font-medium'>3.5 minutos</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Mensagens por conversa</span>
                    <span className='font-medium'>8.2</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Taxa de abandono</span>
                    <span className='font-medium'>12%</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Transferências para humano</span>
                    <span className='font-medium'>15%</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Conversas recorrentes</span>
                    <span className='font-medium'>28%</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Novos usuários</span>
                    <span className='font-medium'>45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='services' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Utilizados</CardTitle>
              </CardHeader>
              <CardContent className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='valor'
                    >
                      {serviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm'>Agendamento</span>
                      <span className='text-sm font-medium'>92%</span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full'
                        style={{ width: '92%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm'>
                        Verificação de Disponibilidade
                      </span>
                      <span className='text-sm font-medium'>88%</span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full'
                        style={{ width: '88%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm'>
                        FAQ / Perguntas Frequentes
                      </span>
                      <span className='text-sm font-medium'>78%</span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-2'>
                      <div
                        className='bg-yellow-500 h-2 rounded-full'
                        style={{ width: '78%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm'>Solicitação de Documentos</span>
                      <span className='text-sm font-medium'>65%</span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-2'>
                      <div
                        className='bg-yellow-500 h-2 rounded-full'
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Total de agendamentos</span>
                  <span className='font-medium'>87</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Taxa de conversão</span>
                  <span className='font-medium'>68%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Agendamentos cancelados</span>
                  <span className='font-medium'>12%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Reagendamentos</span>
                  <span className='font-medium'>15%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Tempo médio até agendamento</span>
                  <span className='font-medium'>2.3 minutos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='satisfaction' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Satisfação do Cliente</CardTitle>
              </CardHeader>
              <CardContent className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='valor'
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback dos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='p-3 bg-muted rounded-md'>
                    <p className='text-sm italic'>
                      "O chatbot foi muito útil e rápido para agendar minha
                      consulta. Recomendo!"
                    </p>
                    <div className='flex items-center justify-between mt-2'>
                      <span className='text-xs text-muted-foreground'>
                        Maria S. - 22/04/2023
                      </span>
                      <div className='flex'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className='w-4 h-4 text-yellow-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='p-3 bg-muted rounded-md'>
                    <p className='text-sm italic'>
                      "Consegui verificar os horários disponíveis facilmente.
                      Interface intuitiva."
                    </p>
                    <div className='flex items-center justify-between mt-2'>
                      <span className='text-xs text-muted-foreground'>
                        João P. - 20/04/2023
                      </span>
                      <div className='flex'>
                        {[1, 2, 3, 4].map((star) => (
                          <svg
                            key={star}
                            className='w-4 h-4 text-yellow-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                          </svg>
                        ))}
                        <svg
                          className='w-4 h-4 text-gray-300'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 bg-muted rounded-md'>
                    <p className='text-sm italic'>
                      "Tive dificuldade em cancelar um agendamento, mas o resto
                      funcionou bem."
                    </p>
                    <div className='flex items-center justify-between mt-2'>
                      <span className='text-xs text-muted-foreground'>
                        Ana R. - 18/04/2023
                      </span>
                      <div className='flex'>
                        {[1, 2, 3].map((star) => (
                          <svg
                            key={star}
                            className='w-4 h-4 text-yellow-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                          </svg>
                        ))}
                        {[1, 2].map((star) => (
                          <svg
                            key={star}
                            className='w-4 h-4 text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Métricas de Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>NPS (Net Promoter Score)</span>
                  <span className='font-medium'>72</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>CSAT (Customer Satisfaction)</span>
                  <span className='font-medium'>4.2/5</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>CES (Customer Effort Score)</span>
                  <span className='font-medium'>2.1/5</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>
                    Taxa de resolução no primeiro contato
                  </span>
                  <span className='font-medium'>78%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Recomendações positivas</span>
                  <span className='font-medium'>82%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

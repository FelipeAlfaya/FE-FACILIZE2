'use client'
import { DashboardHeader } from './components/dashboard-header'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  TrendingUp,
  MessageSquareText,
  Loader2,
  MapPin,
  Video,
  UserCircle,
  Bell,
  Settings,
  Star,
  PencilRuler,
  Percent,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { DashboardChart } from './components/dashboard-chart'

export interface User {
  id: number
  name: string
  email: string
  type: 'PROVIDER' | 'CLIENT'
}

export interface Appointment {
  id: number
  date: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  type: 'VIRTUAL' | 'PRESENTIAL'
  clientId: number
  providerId: number
  serviceId: number
  location: string | null
  notes: string | null
  isProviderToProvider: boolean
  client: {
    id: number
    userId: number
    cpf: string
    client_rating: number
    user: {
      id: number
      name: string
      email: string
    }
  }
  service: {
    id: number
    name: string
    description: string
    price: number
    duration: number
    providerId: number
  }
  provider: {
    id: number
    userId: number
    user: {
      id: number
      name: string
    }
  }
}

interface ProviderDashboardData {
  todayAppointments: {
    total: number
    confirmed: number
    pending: number
    completed: number
  }
  nextAppointment: Appointment | null
  activeClients: number
  monthlyRevenue: number
  recentAppointments: Appointment[]
}

interface ClientDashboardData {
  upcomingAppointments: Appointment[]
  totalAppointments: number
  favoriteProviders: number
  lastProvider: {
    id: number
    name: string
  } | null
}

export default function DashboardPage() {
  const { token, user: authUser } = useAuth()
  const { user: userData } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<'PROVIDER' | 'CLIENT' | null>(null)
  const [greeting, setGreeting] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const [providerData, setProviderData] = useState<ProviderDashboardData>({
    todayAppointments: {
      total: 0,
      confirmed: 0,
      pending: 0,
      completed: 0,
    },
    nextAppointment: null,
    activeClients: 0,
    monthlyRevenue: 0,
    recentAppointments: [],
  })

  const [clientData, setClientData] = useState<ClientDashboardData>({
    upcomingAppointments: [],
    totalAppointments: 0,
    favoriteProviders: 0,
    lastProvider: null,
  })

  useEffect(() => {
    if (authUser?.type) {
      setUserType(authUser.type as 'PROVIDER' | 'CLIENT')
    }

    // Configurar saudação com base na hora do dia
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Bom dia')
    } else if (hour < 18) {
      setGreeting('Boa tarde')
    } else {
      setGreeting('Boa noite')
    }

    // Configurar data atual formatada
    setCurrentDate(format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR }))
  }, [authUser])

  useEffect(() => {
    if (!token || !userData?.id || !userType) return

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Corrigindo a URL do endpoint (removendo a barra inicial se necessário)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl

        // Buscar agendamentos com tratamento de erro melhorado
        const appointmentsResponse = await fetch(`${baseUrl}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!appointmentsResponse.ok) {
          throw new Error(
            `Erro ao buscar agendamentos: ${appointmentsResponse.status} ${appointmentsResponse.statusText}`
          )
        }

        const appointmentsData = await appointmentsResponse.json()
        const appointments = appointmentsData.appointments || []

        if (userType === 'PROVIDER') {
          // Filtrar e ordenar agendamentos para prestadores
          const upcomingAppointments = appointments
            .filter((apt: Appointment) => new Date(apt.date) >= new Date())
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )

          const nextAppointment = upcomingAppointments.find(
            (apt: Appointment) =>
              apt.status === 'CONFIRMED' || apt.status === 'PENDING'
          )

          const today = new Date()
          const todayAppointments = appointments.filter((apt: Appointment) => {
            const aptDate = new Date(apt.date)
            return (
              aptDate.getDate() === today.getDate() &&
              aptDate.getMonth() === today.getMonth() &&
              aptDate.getFullYear() === today.getFullYear()
            )
          })

          setProviderData({
            todayAppointments: {
              total: todayAppointments.length,
              confirmed: todayAppointments.filter(
                (apt: Appointment) => apt.status === 'CONFIRMED'
              ).length,
              pending: todayAppointments.filter(
                (apt: Appointment) => apt.status === 'PENDING'
              ).length,
              completed: todayAppointments.filter(
                (apt: Appointment) => apt.status === 'COMPLETED'
              ).length,
            },
            nextAppointment: nextAppointment || null,
            activeClients: new Set(
              appointments.map((apt: Appointment) => apt.clientId)
            ).size,
            monthlyRevenue: appointments
              .filter(
                (apt: Appointment) =>
                  apt.status === 'CONFIRMED' || apt.status === 'COMPLETED'
              )
              .reduce(
                (sum: number, apt: Appointment) => sum + apt.service.price,
                0
              ),
            recentAppointments: upcomingAppointments.slice(0, 5),
          })
        } else if (userType === 'CLIENT') {
          // Filtrar agendamentos para clientes
          const upcomingAppointments = appointments
            .filter((apt: Appointment) => new Date(apt.date) >= new Date())
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )

          const providers = appointments.map((apt: Appointment) => apt.provider)
          const uniqueProviders = Array.from(
            new Set(providers.map((p: any) => p.id))
          )

          const lastAppointment =
            appointments.length > 0
              ? appointments[appointments.length - 1]
              : null

          // Verificar se o provider e user existem antes de acessar suas propriedades
          const lastProvider =
            lastAppointment &&
            lastAppointment.provider &&
            lastAppointment.provider.user
              ? {
                  id: lastAppointment.provider.id,
                  name:
                    lastAppointment.provider.user.name || 'Nome não disponível',
                }
              : null

          setClientData({
            upcomingAppointments: upcomingAppointments.slice(0, 5),
            totalAppointments: appointments.length,
            favoriteProviders: uniqueProviders.length,
            lastProvider,
          })
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
        setError(
          (error as Error).message || 'Falha ao carregar dados do dashboard'
        )
        toast({
          title: 'Erro',
          description: 'Falha ao carregar dados do dashboard',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (userType) {
      fetchDashboardData()
    }
  }, [token, userData?.id, userType])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <div className='flex flex-col md:flex-row md:items-end justify-between'>
            <div>
              <h1 className='text-2xl font-bold mb-2'>
                {greeting}, {userData?.name || 'Usuário'}
              </h1>
              <p className='text-muted-foreground capitalize'>{currentDate}</p>
            </div>

            <div className='mt-4 md:mt-0'>
              <Badge variant='outline' className='bg-primary/10 text-primary'>
                {userType === 'PROVIDER' ? 'Prestador' : 'Cliente'}
              </Badge>
            </div>
          </div>
        </div>

        {error && (
          <Card className='mb-8 border-destructive'>
            <CardContent className='pt-6'>
              <p className='text-destructive font-medium'>
                {error}. Tente novamente mais tarde ou contate o suporte se o
                problema persistir.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Links rápidos - comum para ambos tipos de usuário */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <Link href='/dashboard/profile'>
            <Card className='hover:bg-accent/50 transition-colors cursor-pointer h-full'>
              <CardContent className='flex flex-col items-center justify-center py-6'>
                <UserCircle className='h-8 w-8 text-primary mb-2' />
                <p className='font-medium text-center'>Meu Perfil</p>
              </CardContent>
            </Card>
          </Link>

          <Link href='/dashboard/schedule'>
            <Card className='hover:bg-accent/50 transition-colors cursor-pointer h-full'>
              <CardContent className='flex flex-col items-center justify-center py-6'>
                <Calendar className='h-8 w-8 text-primary mb-2' />
                <p className='font-medium text-center'>Agenda</p>
              </CardContent>
            </Card>
          </Link>

          <Link href='/dashboard/notifications'>
            <Card className='hover:bg-accent/50 transition-colors cursor-pointer h-full'>
              <CardContent className='flex flex-col items-center justify-center py-6'>
                <Bell className='h-8 w-8 text-primary mb-2' />
                <p className='font-medium text-center'>Notificações</p>
              </CardContent>
            </Card>
          </Link>

          <Link href='/dashboard/settings'>
            <Card className='hover:bg-accent/50 transition-colors cursor-pointer h-full'>
              <CardContent className='flex flex-col items-center justify-center py-6'>
                <Settings className='h-8 w-8 text-primary mb-2' />
                <p className='font-medium text-center'>Configurações</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {userType === 'PROVIDER' ? (
          /* Interface específica para prestadores de serviço */
          <>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Agendamentos Hoje
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {providerData.todayAppointments.total}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {providerData.todayAppointments.confirmed} confirmados,{' '}
                    {providerData.todayAppointments.pending} pendentes,{' '}
                    {providerData.todayAppointments.completed} concluídos
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
                  {providerData.nextAppointment ? (
                    <>
                      <div className='text-2xl font-bold'>
                        {providerData.nextAppointment?.date &&
                          format(
                            new Date(providerData.nextAppointment.date),
                            'HH:mm'
                          )}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {providerData.nextAppointment.service?.name ||
                          'Serviço'}{' '}
                        com{' '}
                        {providerData.nextAppointment.client?.user?.name ||
                          'Cliente'}
                      </p>
                    </>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Nenhum agendamento próximo
                    </p>
                  )}
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
                  <div className='text-2xl font-bold'>
                    {providerData.activeClients}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Neste mês
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
                  <div className='text-2xl font-bold'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(providerData.monthlyRevenue)}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    <Percent className='inline h-3 w-3 text-green-500 mr-1' />
                    <span className='text-green-500'>4.5%</span> vs. mês passado
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-6 md:grid-cols-3 mb-8'>
              <Card className='md:col-span-2'>
                <CardHeader>
                  <CardTitle>Agendamentos Recentes</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {providerData.recentAppointments.length > 0 ? (
                    providerData.recentAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className='flex items-center space-x-3'
                      >
                        <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                          {appointment.type === 'VIRTUAL' ? (
                            <Video className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                          ) : (
                            <MapPin className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm font-medium'>
                            {appointment.service?.name || 'Serviço'}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {format(new Date(appointment.date), 'dd/MM')} às{' '}
                            {appointment.startTime} com{' '}
                            {appointment.provider?.user?.name || 'Prestador'}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            {
                              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300':
                                appointment.status === 'CONFIRMED',
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300':
                                appointment.status === 'PENDING',
                              'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300':
                                appointment.status === 'CANCELLED',
                              'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300':
                                appointment.status === 'COMPLETED',
                            }
                          )}
                        >
                          {appointment.status === 'CONFIRMED'
                            ? 'Confirmado'
                            : appointment.status === 'PENDING'
                            ? 'Pendente'
                            : appointment.status === 'COMPLETED'
                            ? 'Concluído'
                            : 'Cancelado'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground py-2'>
                      Nenhum agendamento recente
                    </p>
                  )}
                  <Button variant='ghost' size='sm' className='w-full' asChild>
                    <Link href='/dashboard/schedule'>
                      Ver todos
                      <ArrowRight className='ml-1 h-4 w-4' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acesso Rápido</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    asChild
                  >
                    <Link href='/dashboard/services'>
                      <PencilRuler className='mr-2 h-4 w-4' />
                      Gerenciar Serviços
                    </Link>
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    asChild
                  >
                    <Link href='/dashboard/availability'>
                      <Clock className='mr-2 h-4 w-4' />
                      Definir Disponibilidade
                    </Link>
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    asChild
                  >
                    <Link href='/dashboard/clients'>
                      <Users className='mr-2 h-4 w-4' />
                      Meus Clientes
                    </Link>
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    asChild
                  >
                    <Link href='/dashboard/reports'>
                      <TrendingUp className='mr-2 h-4 w-4' />
                      Relatórios
                    </Link>
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    asChild
                  >
                    <Link href='/dashboard/chatbot'>
                      <MessageSquareText className='mr-2 h-4 w-4' />
                      Chatbot WhatsApp
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Chart para prestadores */}
            <DashboardChart />
          </>
        ) : (
          /* Interface específica para clientes */
          <>
            <div className='grid gap-6 md:grid-cols-3 mb-8'>
              {/* Visualização de próximos agendamentos */}
              <div className='md:col-span-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Próximos Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientData.upcomingAppointments.length > 0 ? (
                      <div className='space-y-4'>
                        {clientData.upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className='flex items-center space-x-3'
                          >
                            <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                              {appointment.type === 'VIRTUAL' ? (
                                <Video className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                              ) : (
                                <MapPin className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                              )}
                            </div>
                            <div className='flex-1'>
                              <p className='text-sm font-medium'>
                                {appointment.service?.name || 'Serviço'}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {format(new Date(appointment.date), 'dd/MM')} às{' '}
                                {appointment.startTime} com{' '}
                                {appointment.provider?.user?.name ||
                                  'Prestador'}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                {
                                  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300':
                                    appointment.status === 'CONFIRMED',
                                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300':
                                    appointment.status === 'PENDING',
                                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300':
                                    appointment.status === 'CANCELLED',
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300':
                                    appointment.status === 'COMPLETED',
                                }
                              )}
                            >
                              {appointment.status === 'CONFIRMED'
                                ? 'Confirmado'
                                : appointment.status === 'PENDING'
                                ? 'Pendente'
                                : appointment.status === 'COMPLETED'
                                ? 'Concluído'
                                : 'Cancelado'}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant='ghost'
                          size='sm'
                          className='w-full'
                          asChild
                        >
                          <Link href='/dashboard/schedule'>
                            Ver todos
                            <ArrowRight className='ml-1 h-4 w-4' />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className='text-center py-8'>
                        <p className='text-muted-foreground mb-4'>
                          Você não tem agendamentos próximos
                        </p>
                        <Button asChild>
                          <Link href='/dashboard/find-providers'>
                            Agendar Serviço
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Cards com estatísticas do cliente */}
              <div className='space-y-6'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total de Agendamentos
                    </CardTitle>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {clientData.totalAppointments}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Prestadores Favoritos
                    </CardTitle>
                    <Star className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {clientData.favoriteProviders}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Último Prestador
                    </CardTitle>
                    <Users className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    {clientData.lastProvider ? (
                      <>
                        <div className='text-lg font-bold truncate'>
                          {clientData.lastProvider.name}
                        </div>
                        <Button
                          variant='link'
                          className='p-0 h-auto text-sm'
                          asChild
                        >
                          <Link
                            href={`/dashboard/providers/${clientData.lastProvider.id}`}
                          >
                            Ver perfil
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <p className='text-sm text-muted-foreground'>
                        Nenhum prestador visitado
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Seção de navegação rápida para clientes */}
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Atalhos</CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                  <Button asChild>
                    <Link href='/dashboard/find-providers'>
                      Encontrar Prestadores
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href='/dashboard/schedule'>Meus Agendamentos</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/dashboard/favorites'>Favoritos</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/dashboard/reviews'>Minhas Avaliações</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Descobrir Serviços</CardTitle>
                  <CardDescription>
                    Serviços populares perto de você
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3'>
                        <PencilRuler className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>
                          Design de Sobrancelhas
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          A partir de R$ 40,00
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3'>
                        <PencilRuler className='h-5 w-5 text-green-600 dark:text-green-400' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>Corte de Cabelo</p>
                        <p className='text-xs text-muted-foreground'>
                          A partir de R$ 30,00
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3'>
                        <PencilRuler className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>
                          Massagem Relaxante
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          A partir de R$ 90,00
                        </p>
                      </div>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full'
                      asChild
                    >
                      <Link href='/dashboard/services-catalog'>
                        Explorar mais serviços
                        <ArrowRight className='ml-1 h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

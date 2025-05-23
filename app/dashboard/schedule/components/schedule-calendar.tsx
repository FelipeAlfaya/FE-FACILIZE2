'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  User,
  MapPin,
  Video,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'
import {
  format,
  isSameDay,
  addDays,
  subDays,
  isToday,
  isTomorrow,
  isYesterday,
  startOfMonth,
  endOfMonth,
  isPast,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AppointmentDetailsModal } from './appointment-details-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'

type AppointmentType = 'PRESENTIAL' | 'VIRTUAL' | 'NOT_SPECIFIED'

type AppointmentUser = {
  id: number
  name: string
  email: string
  phone: string | null
  type: 'PROVIDER' | 'CLIENT'
}

type Appointment = {
  id: number
  date: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  type: AppointmentType
  clientId: number | null
  providerId: number
  serviceId: number
  location: string | null
  notes: string | null
  isProviderToProvider: boolean
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  cancelledAt: Date | null
  confirmedAt: Date | null
  userId: number | null
  client: {
    id: number
    user: AppointmentUser
  } | null
  provider: {
    id: number
    user: AppointmentUser
  }
  service: {
    id: number
    name: string
    description: string
    price: number
    duration: number
    providerId: number
  }
  User: AppointmentUser | null // For provider-to-provider appointments
}

type PersonalAppointment = {
  id: number
  title: string
  description: string | null
  date: Date
  startTime: string
  endTime: string
  location: string | null
  isAllDay: boolean
  color: string
  userId: number
  createdAt: Date
  updatedAt: Date
}

export function ScheduleCalendar() {
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [personalAppointments, setPersonalAppointments] = useState<
    PersonalAppointment[]
  >([])
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending'>(
    'all'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    const fetchAppointments = async () => {
      if (!token) {
        console.log('No token found')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const startDate = startOfMonth(selectedDate)
        const endDate = endOfMonth(selectedDate)

        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }appointments/by-date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        // Transformar os agendamentos normais
        const transformedAppointments = data.appointments.map(
          (appointment: any) => ({
            ...appointment,
            date: new Date(appointment.date),
            createdAt: new Date(appointment.createdAt),
            updatedAt: new Date(appointment.updatedAt),
            completedAt: appointment.completedAt
              ? new Date(appointment.completedAt)
              : null,
            cancelledAt: appointment.cancelledAt
              ? new Date(appointment.cancelledAt)
              : null,
            confirmedAt: appointment.confirmedAt
              ? new Date(appointment.confirmedAt)
              : null,
          })
        )

        // Transformar os compromissos pessoais
        const transformedPersonalAppointments = data.personalAppointments.map(
          (appointment: any) => ({
            ...appointment,
            date: new Date(appointment.date),
            createdAt: new Date(appointment.createdAt),
            updatedAt: new Date(appointment.updatedAt),
          })
        )

        setAppointments(transformedAppointments)
        setPersonalAppointments(transformedPersonalAppointments)
        setError(null)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to fetch appointments'
        )
        toast({
          title: 'Error',
          description: 'Failed to load appointments',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [selectedDate])

  const renderAppointmentName = (appointment: Appointment) => {
    if (appointment.isProviderToProvider) {
      return appointment.User?.name || 'Provider not found'
    }
    return appointment.client?.user?.name || 'Client not found'
  }

  useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'true') {
      toast({
        title: 'Sucesso',
        description: 'Agendamento realizado com sucesso!',
      })
    }
  }, [searchParams])

  const appointmentsForSelectedDate = useMemo(() => {
    const regular = appointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), selectedDate)
    )

    const personal = personalAppointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), selectedDate)
    )

    return [...regular, ...personal]
  }, [appointments, personalAppointments, selectedDate])

  const confirmedAppointments = useMemo(
    () =>
      appointmentsForSelectedDate.filter(
        (a) =>
          'title' in a || a.status === 'CONFIRMED' || a.status === 'COMPLETED'
      ),
    [appointmentsForSelectedDate]
  )

  const pendingAppointments = useMemo(
    () =>
      appointmentsForSelectedDate.filter(
        (a) => 'status' in a && a.status === 'PENDING'
      ),
    [appointmentsForSelectedDate]
  )

  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1))
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1))

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleConfirmAppointment = async (
    appointmentId: number
  ): Promise<void> => {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/${appointmentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: 'CONFIRMED',
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao confirmar agendamento')
      }

      const updatedAppointment = await response.json()

      // Update appointments list
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === updatedAppointment.id
            ? {
                ...updatedAppointment,
                date: new Date(updatedAppointment.date),
                createdAt: new Date(updatedAppointment.createdAt),
                updatedAt: new Date(updatedAppointment.updatedAt),
                completedAt: updatedAppointment.completedAt
                  ? new Date(updatedAppointment.completedAt)
                  : null,
                cancelledAt: updatedAppointment.cancelledAt
                  ? new Date(updatedAppointment.cancelledAt)
                  : null,
                confirmedAt: updatedAppointment.confirmedAt
                  ? new Date(updatedAppointment.confirmedAt)
                  : null,
              }
            : a
        )
      )

      toast({
        title: 'Sucesso',
        description: 'Agendamento confirmado com sucesso!',
      })
    } catch (error) {
      console.error('Error confirming appointment:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível confirmar o agendamento',
        variant: 'destructive',
      })
      throw error // Propaga o erro para que o componente modal possa tratá-lo
    }
  }

  const handleCompleteAppointment = async (
    appointmentId: number
  ): Promise<void> => {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/${appointmentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'COMPLETED' }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao marcar agendamento como concluído')
      }

      const updatedAppointment = await response.json()

      // Atualizar lista de agendamentos
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === updatedAppointment.id
            ? {
                ...updatedAppointment,
                date: new Date(updatedAppointment.date),
                createdAt: new Date(updatedAppointment.createdAt),
                updatedAt: new Date(updatedAppointment.updatedAt),
                completedAt: updatedAppointment.completedAt
                  ? new Date(updatedAppointment.completedAt)
                  : null,
                cancelledAt: updatedAppointment.cancelledAt
                  ? new Date(updatedAppointment.cancelledAt)
                  : null,
                confirmedAt: updatedAppointment.confirmedAt
                  ? new Date(updatedAppointment.confirmedAt)
                  : null,
              }
            : a
        )
      )

      toast({
        title: 'Sucesso',
        description: 'Agendamento marcado como concluído!',
      }) // Aguardar um momento antes de mostrar a notificação de avaliação      // para garantir que o backend processou a atualização      setTimeout(() => {        console.log('Tentando mostrar notificação de review para appointmentId:', appointmentId)        showNotification(appointmentId)      }, 1500)
    } catch (error) {
      console.error('Error completing appointment:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar o agendamento como concluído',
        variant: 'destructive',
      })
      throw error // Propaga o erro para que o componente modal possa tratá-lo
    }
  }

  const handleCancelAppointment = async (
    appointmentId: number
  ): Promise<void> => {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')

    if (!token) {
      toast({
        title: 'Erro',
        description:
          'Você precisa estar autenticado para cancelar um agendamento',
        variant: 'destructive',
      })
      throw new Error('Usuário não autenticado')
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/${appointmentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: 'CANCELLED',
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao cancelar agendamento')
      }

      const updatedAppointment = await response.json()

      // Update appointments list with proper date handling
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === updatedAppointment.id
            ? {
                ...updatedAppointment,
                date: new Date(updatedAppointment.date),
                createdAt: new Date(updatedAppointment.createdAt),
                updatedAt: new Date(updatedAppointment.updatedAt),
                completedAt: updatedAppointment.completedAt
                  ? new Date(updatedAppointment.completedAt)
                  : null,
                cancelledAt: updatedAppointment.cancelledAt
                  ? new Date(updatedAppointment.cancelledAt)
                  : null,
                confirmedAt: updatedAppointment.confirmedAt
                  ? new Date(updatedAppointment.confirmedAt)
                  : null,
              }
            : a
        )
      )

      toast({
        title: 'Sucesso',
        description: 'Agendamento cancelado com sucesso!',
      })
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o agendamento',
        variant: 'destructive',
      })
      throw error // Propaga o erro para que o componente modal possa tratá-lo
    }
  }

  // Function to get dates with appointments for highlighting in calendar
  const getDatesWithAppointments = () => {
    const dates = new Map<string, { count: number; statuses: Set<string> }>()

    // Processar appointments normais
    appointments.forEach((appointment) => {
      const dateStr = format(new Date(appointment.date), 'yyyy-MM-dd')
      if (!dates.has(dateStr)) {
        dates.set(dateStr, { count: 0, statuses: new Set() })
      }
      const dateInfo = dates.get(dateStr)!
      dateInfo.count++
      dateInfo.statuses.add(appointment.status)
    })

    // Processar personalAppointments
    personalAppointments.forEach((appointment) => {
      const dateStr = format(new Date(appointment.date), 'yyyy-MM-dd')
      if (!dates.has(dateStr)) {
        dates.set(dateStr, { count: 0, statuses: new Set() })
      }
      const dateInfo = dates.get(dateStr)!
      dateInfo.count++
      dateInfo.statuses.add('PERSONAL') // Marcador para compromissos pessoais
    })

    return dates
  }

  const datesWithAppointments = getDatesWithAppointments()

  // Function to format date display
  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Hoje'
    if (isTomorrow(date)) return 'Amanhã'
    if (isYesterday(date)) return 'Ontem'
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  // Function to get appointment type icon
  const getAppointmentTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'PRESENTIAL':
        return <MapPin className='h-4 w-4 text-emerald-600' />
      case 'VIRTUAL':
        return <Video className='h-4 w-4 text-blue-600' />
      default:
        return <CalendarCheck className='h-4 w-4 text-gray-600' />
    }
  }

  // Function to get appointment type text
  const getAppointmentTypeText = (type: AppointmentType) => {
    switch (type) {
      case 'PRESENTIAL':
        return 'Presencial'
      case 'VIRTUAL':
        return 'Videoconferência'
      default:
        return 'Não especificado'
    }
  }

  // Function to get status color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return ''
    }
  }

  const getAppointmentDisplayName = (appointment: Appointment) => {
    if (appointment.isProviderToProvider) {
      return appointment.User?.name || 'Provedor não encontrado'
    }
    return appointment.client?.user?.name || 'Cliente não encontrado'
  }

  // Function to get status text
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado'
      case 'PENDING':
        return 'Pendente'
      case 'CANCELLED':
        return 'Cancelado'
      case 'COMPLETED':
        return 'Concluído'
      default:
        return ''
    }
  }

  // Função para verificar se o agendamento já passou
  const isAppointmentPast = (appointment: Appointment): boolean => {
    const appointmentDate = new Date(appointment.date)
    const [hours, minutes] = appointment.endTime.split(':').map(Number)
    const appointmentDateTime = new Date(appointmentDate)
    appointmentDateTime.setHours(hours, minutes)

    return isPast(appointmentDateTime)
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      <div className='md:col-span-1'>
        <Card className='bg-card text-card-foreground'>
          <CardHeader>
            <CardTitle className='text-lg'>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className='rounded-md border'
              modifiers={{
                appointment: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  return datesWithAppointments.has(dateStr)
                },
                today: (date) => isToday(date),
              }}
              modifiersStyles={{
                appointment: {
                  fontWeight: 'bold',
                },
                today: {
                  fontWeight: 'bold',
                  borderColor: 'rgb(16 185 129)',
                  color: 'rgb(16 185 129)',
                },
              }}
              components={{
                DayContent: ({ date, displayMonth }) => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  const hasAppointments = datesWithAppointments.has(dateStr)
                  const appointmentInfo = datesWithAppointments.get(dateStr)

                  return (
                    <div className='relative w-full h-full flex items-center justify-center'>
                      {date.getDate()}
                      {hasAppointments && (
                        <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2'>
                          <div className='flex gap-0.5'>
                            {appointmentInfo?.statuses.has('CONFIRMED') && (
                              <div className='h-1 w-1 rounded-full bg-emerald-500'></div>
                            )}
                            {appointmentInfo?.statuses.has('PENDING') && (
                              <div className='h-1 w-1 rounded-full bg-yellow-500'></div>
                            )}
                            {appointmentInfo?.statuses.has('CANCELLED') && (
                              <div className='h-1 w-1 rounded-full bg-red-500'></div>
                            )}
                            {appointmentInfo?.statuses.has('COMPLETED') && (
                              <div className='h-1 w-1 rounded-full bg-blue-500'></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                },
              }}
            />

            <div className='mt-4 space-y-2'>
              <div className='flex items-center'>
                <div className='w-3 h-3 rounded-full bg-emerald-500 mr-2'></div>
                <span className='text-sm'>Confirmados</span>
              </div>
              <div className='flex items-center'>
                <div className='w-3 h-3 rounded-full bg-yellow-500 mr-2'></div>
                <span className='text-sm'>Pendentes</span>
              </div>
              <div className='flex items-center'>
                <div className='w-3 h-3 rounded-full bg-red-500 mr-2'></div>
                <span className='text-sm'>Cancelados</span>
              </div>
              <div className='flex items-center'>
                <div className='w-3 h-3 rounded-full bg-blue-500 mr-2'></div>
                <span className='text-sm'>Concluídos</span>
              </div>
            </div>

            <div className='mt-6'>
              <h3 className='text-sm font-medium mb-2'>Resumo do Mês</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div className='bg-muted p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-emerald-600'>
                    {
                      appointments.filter((a) => a.status === 'CONFIRMED')
                        .length
                    }
                  </span>
                  <span className='text-xs text-gray-500'>Confirmados</span>
                </div>
                <div className='bg-muted p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-yellow-600'>
                    {appointments.filter((a) => a.status === 'PENDING').length}
                  </span>
                  <span className='text-xs text-gray-500'>Pendentes</span>
                </div>
                <div className='bg-muted p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-blue-600'>
                    {
                      appointments.filter((a) => a.status === 'COMPLETED')
                        .length
                    }
                  </span>
                  <span className='text-xs text-gray-500'>Concluídos</span>
                </div>
                <div className='bg-muted p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-gray-600'>
                    {appointments.length}
                  </span>
                  <span className='text-xs text-gray-500'>Total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='md:col-span-2'>
        <Card className='bg-card text-card-foreground'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='flex flex-col space-y-1.5'>
              <CardTitle className='text-lg'>Agendamentos</CardTitle>
              <p className='text-sm text-muted-foreground'>
                {formatDateDisplay(selectedDate)}
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button variant='outline' size='icon' onClick={goToPreviousDay}>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon' onClick={goToNextDay}>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue='all'
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
            >
              <TabsList className='grid w-full grid-cols-3 mb-4'>
                <TabsTrigger value='all'>
                  Todos
                  {appointmentsForSelectedDate.length > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {appointmentsForSelectedDate.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value='confirmed'>
                  Confirmados
                  {confirmedAppointments.length > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {confirmedAppointments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value='pending'>
                  Pendentes
                  {pendingAppointments.length > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {pendingAppointments.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value='all' className='space-y-4'>
                {appointmentsForSelectedDate.length > 0 ? (
                  <div className='space-y-4'>
                    {appointmentsForSelectedDate
                      .sort((a, b) => {
                        // Both types have startTime property, so we can access it directly
                        const timeA = a.startTime
                        const timeB = b.startTime
                        return timeA.localeCompare(timeB)
                      })
                      .map((item) => {
                        // Check if the item is a personal appointment
                        const isPersonalAppointment = 'title' in item

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              'flex items-start justify-between p-4 border rounded-lg',
                              !isPersonalAppointment &&
                                item.status === 'CANCELLED' &&
                                'opacity-70'
                            )}
                          >
                            <div className='flex items-start space-x-4'>
                              <div className='flex-shrink-0'>
                                <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                  <User className='h-5 w-5 text-gray-600' />
                                </div>
                              </div>
                              <div>
                                {isPersonalAppointment ? (
                                  // Personal Appointment Display
                                  <>
                                    <h4 className='font-medium'>
                                      {item.title}
                                    </h4>
                                    {item.description && (
                                      <p className='text-sm text-gray-600'>
                                        {item.description}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  // Regular Appointment Display
                                  <>
                                    <h4 className='font-medium'>
                                      {getAppointmentDisplayName(item)}
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                      {item.service.name}
                                    </p>
                                  </>
                                )}
                                <div className='flex items-center mt-1 text-sm text-gray-500'>
                                  <Clock className='h-3 w-3 mr-1' />
                                  <span>
                                    {item.startTime} - {item.endTime}
                                  </span>
                                  {!isPersonalAppointment && (
                                    <div className='flex items-center ml-3'>
                                      {getAppointmentTypeIcon(item.type)}
                                      <span className='ml-1'>
                                        {getAppointmentTypeText(item.type)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {item.location && (
                                  <div className='flex items-center mt-1 text-sm text-gray-500'>
                                    <MapPin className='h-3 w-3 mr-1' />
                                    <span>{item.location}</span>
                                  </div>
                                )}
                                {!isPersonalAppointment &&
                                  item.isProviderToProvider && (
                                    <Badge
                                      variant='outline'
                                      className='mt-2 bg-blue-50 text-blue-600 border-blue-200'
                                    >
                                      Agendamento entre Provedores
                                    </Badge>
                                  )}
                                {isPersonalAppointment && (
                                  <Badge
                                    variant='outline'
                                    className='mt-2'
                                    style={{
                                      backgroundColor: `${item.color}15`,
                                      color: item.color,
                                      borderColor: `${item.color}30`,
                                    }}
                                  >
                                    Compromisso Pessoal
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                              {!isPersonalAppointment && (
                                <>
                                  <Badge
                                    variant='outline'
                                    className={getStatusColor(item.status)}
                                  >
                                    {getStatusText(item.status)}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant='ghost' size='icon'>
                                        <MoreHorizontal className='h-4 w-4' />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                      <DropdownMenuItem
                                        onClick={() => handleViewDetails(item)}
                                      >
                                        Ver detalhes
                                      </DropdownMenuItem>
                                      {item.status === 'PENDING' && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleConfirmAppointment(item.id)
                                          }
                                        >
                                          Confirmar
                                        </DropdownMenuItem>
                                      )}
                                      {item.status === 'CONFIRMED' &&
                                        isAppointmentPast(item) && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleCompleteAppointment(item.id)
                                            }
                                          >
                                            Marcar como concluído
                                          </DropdownMenuItem>
                                        )}
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCancelAppointment(item.id)
                                        }
                                      >
                                        Cancelar
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      Nenhum agendamento para esta data
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='confirmed' className='space-y-4'>
                {confirmedAppointments.length > 0 ? (
                  <div className='space-y-4'>
                    {confirmedAppointments
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className='flex items-start justify-between p-4 border rounded-lg'
                        >
                          <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                              <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                <User className='h-5 w-5 text-gray-600' />
                              </div>
                            </div>
                            <div>
                              <h4 className='font-medium'>
                                {'title' in appointment
                                  ? appointment.title
                                  : appointment.client?.user.name}
                              </h4>
                              <p className='text-sm text-gray-600'>
                                {'service' in appointment
                                  ? appointment.service.name
                                  : ''}
                              </p>
                              <div className='flex items-center mt-1 text-sm text-gray-500'>
                                <Clock className='h-3 w-3 mr-1' />
                                <span>
                                  {appointment.startTime} -{' '}
                                  {appointment.endTime}
                                </span>
                                <div className='flex items-center ml-3'>
                                  {'type' in appointment &&
                                    getAppointmentTypeIcon(appointment.type)}
                                  <span className='ml-1'>
                                    {'type' in appointment &&
                                      getAppointmentTypeIcon(appointment.type)}
                                  </span>
                                </div>
                              </div>
                              {appointment.location && (
                                <div className='flex items-center mt-1 text-sm text-gray-500'>
                                  <MapPin className='h-3 w-3 mr-1' />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {'status' in appointment && (
                            <div className='flex items-center space-x-2'>
                              <Badge
                                variant='outline'
                                className={getStatusColor(appointment.status)}
                              >
                                {getStatusText(appointment.status)}
                              </Badge>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleViewDetails(appointment as Appointment)
                                }
                              >
                                Detalhes
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      Nenhum agendamento confirmado para esta data
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='pending' className='space-y-4'>
                {pendingAppointments.length > 0 ? (
                  <div className='space-y-4'>
                    {pendingAppointments
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className='flex items-start justify-between p-4 border rounded-lg'
                        >
                          <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                              <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                <User className='h-5 w-5 text-gray-600' />
                              </div>
                            </div>
                            <div>
                              <h4 className='font-medium'>
                                {'client' in appointment
                                  ? appointment.client?.user.name
                                  : appointment.title}
                              </h4>
                              <p className='text-sm text-gray-600'>
                                {'service' in appointment
                                  ? appointment.service.name
                                  : ''}
                              </p>
                              <div className='flex items-center mt-1 text-sm text-gray-500'>
                                <Clock className='h-3 w-3 mr-1' />
                                <span>
                                  {appointment.startTime} -{' '}
                                  {appointment.endTime}
                                </span>
                                <div className='flex items-center ml-3'>
                                  {'type' in appointment && (
                                    <>
                                      {getAppointmentTypeIcon(appointment.type)}
                                      <span className='ml-1'>
                                        {getAppointmentTypeText(
                                          appointment.type
                                        )}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {appointment.location && (
                                <div className='flex items-center mt-1 text-sm text-gray-500'>
                                  <MapPin className='h-3 w-3 mr-1' />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge
                              variant='outline'
                              className='bg-yellow-100 text-yellow-800 border-yellow-200'
                            >
                              Pendente
                            </Badge>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                if ('status' in appointment) {
                                  handleViewDetails(appointment as Appointment)
                                }
                              }}
                            >
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      Nenhum agendamento pendente para esta data
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <AppointmentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleConfirmAppointment}
        onComplete={handleCompleteAppointment}
        onCancel={handleCancelAppointment}
      />
    </div>
  )
}

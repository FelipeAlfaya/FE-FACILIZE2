'use client'

import { useState, useEffect, useMemo } from 'react'
import { CalendarIcon, Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { AppointmentDetailsModal } from '../../schedule/components/appointment-details-modal'
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from '@/hooks/use-toast'
import { Appointment, AppointmentStatus } from '@/types/appointment'

export function ProviderDashboard() {
  const [date, setDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending'>(
    'all'
  )

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const fetchAppointments = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const startDate = startOfMonth(date)
        const endDate = endOfMonth(date)

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/appointments/by-date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }

        const data = await response.json()

        // Transform the data
        const transformedData = data.map((appointment: any) => ({
          ...appointment,
          date: new Date(appointment.date),
          createdAt: new Date(appointment.createdAt),
          updatedAt: new Date(appointment.updatedAt),
          confirmedAt: appointment.confirmedAt
            ? new Date(appointment.confirmedAt)
            : null,
          completedAt: appointment.completedAt
            ? new Date(appointment.completedAt)
            : null,
          cancelledAt: appointment.cancelledAt
            ? new Date(appointment.cancelledAt)
            : null,
        }))

        setAppointments(transformedData)
      } catch (error) {
        console.error('Error fetching appointments:', error)
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
  }, [date])

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date)
    )
  }, [appointments, date])

  const confirmedAppointments = useMemo(
    () =>
      filteredAppointments.filter(
        (a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED'
      ),
    [filteredAppointments]
  )

  const pendingAppointments = useMemo(
    () => filteredAppointments.filter((a) => a.status === 'PENDING'),
    [filteredAppointments]
  )

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleConfirmAppointment = async (appointmentId: number) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/${appointmentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'CONFIRMED' }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao confirmar agendamento')
      }

      const updatedAppointment = await response.json()
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === updatedAppointment.id ? updatedAppointment : a
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
    }
  }

  const handleCompleteAppointment = async (appointmentId: number) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
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
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === updatedAppointment.id ? updatedAppointment : a
        )
      )

      toast({
        title: 'Sucesso',
        description: 'Agendamento marcado como concluído!',
      })
    } catch (error) {
      console.error('Error completing appointment:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar o agendamento como concluído',
        variant: 'destructive',
      })
    }
  }

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

  const getDatesWithAppointments = () => {
    const dates = new Map<string, Set<AppointmentStatus>>()
    appointments.forEach((appointment) => {
      const dateStr = format(new Date(appointment.date), 'yyyy-MM-dd')
      if (!dates.has(dateStr)) {
        dates.set(dateStr, new Set())
      }
      dates.get(dateStr)?.add(appointment.status)
    })
    return dates
  }

  const datesWithAppointments = getDatesWithAppointments()

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* Calendário */}
      <div className='md:col-span-1'>
        <Card className='bg-card text-card-foreground'>
          <CardHeader>
            <CardTitle className='text-lg'>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode='single'
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className='rounded-md border'
              modifiers={{
                appointment: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  return datesWithAppointments.has(dateStr)
                },
                today: (date) => isSameDay(date, new Date()),
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
                DayContent: ({ date }) => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  const hasAppointments = datesWithAppointments.has(dateStr)
                  const statuses = datesWithAppointments.get(dateStr)

                  return (
                    <div className='relative w-full h-full flex items-center justify-center'>
                      {date.getDate()}
                      {hasAppointments && (
                        <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2'>
                          <div className='flex gap-0.5'>
                            {statuses?.has('CONFIRMED') && (
                              <div className='h-1 w-1 rounded-full bg-emerald-500'></div>
                            )}
                            {statuses?.has('PENDING') && (
                              <div className='h-1 w-1 rounded-full bg-yellow-500'></div>
                            )}
                            {statuses?.has('CANCELLED') && (
                              <div className='h-1 w-1 rounded-full bg-red-500'></div>
                            )}
                            {statuses?.has('COMPLETED') && (
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
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <div className='md:col-span-2'>
        <Card className='bg-card text-card-foreground'>
          <CardHeader>
            <CardTitle className='text-lg'>
              Agendamentos -{' '}
              {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue='all'
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            >
              <TabsList className='grid w-full grid-cols-3 mb-4'>
                <TabsTrigger value='all'>Todos</TabsTrigger>
                <TabsTrigger value='confirmed'>Confirmados</TabsTrigger>
                <TabsTrigger value='pending'>Pendentes</TabsTrigger>
              </TabsList>

              <TabsContent value='all' className='space-y-4'>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex items-start space-x-4'>
                        <div className='flex-shrink-0'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                            <User className='h-5 w-5 text-gray-600' />
                          </div>
                        </div>
                        <div>
                          <h4 className='font-medium'>
                            {appointment.client?.user?.name}
                          </h4>
                          <p className='text-sm text-gray-600'>
                            {appointment.service.name}
                          </p>
                          <div className='flex items-center mt-1 text-sm text-gray-500'>
                            <CalendarIcon className='h-3 w-3 mr-1' />
                            <span>
                              {new Date(appointment.date).toLocaleDateString(
                                'pt-BR'
                              )}
                            </span>
                            <Clock className='h-3 w-3 ml-3 mr-1' />
                            <span>{appointment.startTime}</span>
                          </div>
                        </div>
                      </div>
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
                          onClick={() => handleViewDetails(appointment)}
                        >
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      Nenhum agendamento para esta data
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='confirmed' className='space-y-4'>
                {filteredAppointments.filter((a) => a.status === 'CONFIRMED')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'CONFIRMED')
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className='flex items-center justify-between p-4 border rounded-lg'
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='flex-shrink-0'>
                            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                              <User className='h-5 w-5 text-gray-600' />
                            </div>
                          </div>
                          <div>
                            <h4 className='font-medium'>
                              {appointment.client?.user?.name}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {appointment.service.name}
                            </p>
                            <div className='flex items-center mt-1 text-sm text-gray-500'>
                              <CalendarIcon className='h-3 w-3 mr-1' />
                              <span>
                                {new Date(appointment.date).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </span>
                              <Clock className='h-3 w-3 ml-3 mr-1' />
                              <span>{appointment.startTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Badge
                            variant='outline'
                            className='bg-green-100 text-green-800 border-green-200'
                          >
                            Confirmado
                          </Badge>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleViewDetails(appointment)}
                          >
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      Nenhum agendamento confirmado para esta data
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='pending' className='space-y-4'>
                {filteredAppointments.filter((a) => a.status === 'PENDING')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'PENDING')
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className='flex items-center justify-between p-4 border rounded-lg'
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='flex-shrink-0'>
                            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                              <User className='h-5 w-5 text-gray-600' />
                            </div>
                          </div>
                          <div>
                            <h4 className='font-medium'>
                              {appointment.client?.user?.name}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {appointment.service.name}
                            </p>
                            <div className='flex items-center mt-1 text-sm text-gray-500'>
                              <CalendarIcon className='h-3 w-3 mr-1' />
                              <span>
                                {new Date(appointment.date).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </span>
                              <Clock className='h-3 w-3 ml-3 mr-1' />
                              <span>{appointment.startTime}</span>
                            </div>
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
                            onClick={() => handleViewDetails(appointment)}
                          >
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    ))
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
      />
    </div>
  )
}

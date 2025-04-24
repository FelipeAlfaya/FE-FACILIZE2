'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, User } from 'lucide-react'
import { AppointmentDetailsModal } from './appointment-details-modal'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

type Appointment = {
  id: string
  clientName: string
  service: string
  date: Date
  time: string
  status: AppointmentStatus
}

export function ScheduleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }

        const data = await response.json()
        const mappedAppointments = data.map((appointment: any) => ({
          id: appointment.id.toString(),
          clientName: appointment.client?.user?.name || 'Cliente não informado',
          service: appointment.service?.name || 'Serviço não informado',
          date: new Date(appointment.date),
          time: new Date(appointment.date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: mapStatus(appointment.status),
        }))

        setAppointments(mappedAppointments)
      } catch (error) {
        toast.error('Erro ao carregar agendamentos')
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const mapStatus = (status: string): AppointmentStatus => {
    switch (status) {
      case 'CONFIRMED':
        return 'confirmed'
      case 'PENDING':
        return 'pending'
      case 'CANCELLED':
        return 'cancelled'
      case 'COMPLETED':
        return 'completed'
      default:
        return 'pending'
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (!date) return true
    return (
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    )
  })

  const handleConfirmAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      if (!response.ok) {
        throw new Error('Failed to confirm appointment')
      }

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: 'confirmed' } : app
        )
      )

      toast.success('Agendamento confirmado com sucesso!')
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Erro ao confirmar agendamento')
      console.error('Error:', error)
    }
  }

  const handleCancelAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel appointment')
      }

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: 'cancelled' } : app
        )
      )

      toast.success('Agendamento cancelado com sucesso!')
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Erro ao cancelar agendamento')
      console.error('Error:', error)
    }
  }

  const getDatesWithAppointments = () => {
    const dates: Record<
      string,
      {
        confirmed: number
        pending: number
        cancelled: number
        completed: number
      }
    > = {}

    appointments.forEach((appointment) => {
      const dateStr = appointment.date.toDateString()
      if (!dates[dateStr]) {
        dates[dateStr] = {
          confirmed: 0,
          pending: 0,
          cancelled: 0,
          completed: 0,
        }
      }
      dates[dateStr][appointment.status]++
    })

    return dates
  }

  const datesWithAppointments = getDatesWithAppointments()

  if (isLoading) {
    return (
      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className='h-[300px] w-full rounded-md' />
              <div className='mt-4 space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                Carregando agendamentos...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className='h-[100px] w-full rounded-lg' />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* Calendário */}
      <div className='md:col-span-1'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode='single'
              selected={date}
              onSelect={setDate}
              className='rounded-md border'
              modifiers={{
                appointment: (date) => {
                  const dateStr = date.toDateString()
                  return !!datesWithAppointments[dateStr]
                },
              }}
              modifiersStyles={{
                appointment: {
                  fontWeight: 'bold',
                  backgroundColor: '#EBF5FF',
                  color: '#1E40AF',
                },
              }}
            />

            <div className='mt-4 space-y-2'>
              <div className='flex items-center'>
                <div className='w-3 h-3 rounded-full bg-green-500 mr-2'></div>
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
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-green-600'>
                    {
                      appointments.filter((a) => a.status === 'confirmed')
                        .length
                    }
                  </span>
                  <span className='text-xs text-gray-500'>Confirmados</span>
                </div>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-yellow-600'>
                    {appointments.filter((a) => a.status === 'pending').length}
                  </span>
                  <span className='text-xs text-gray-500'>Pendentes</span>
                </div>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-red-600'>
                    {
                      appointments.filter((a) => a.status === 'cancelled')
                        .length
                    }
                  </span>
                  <span className='text-xs text-gray-500'>Cancelados</span>
                </div>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-blue-600'>
                    {appointments.length}
                  </span>
                  <span className='text-xs text-gray-500'>Total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <div className='md:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>
              Agendamentos {date && `- ${date.toLocaleDateString('pt-BR')}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='all'>
              <TabsList className='grid w-full grid-cols-4 mb-4'>
                <TabsTrigger value='all'>Todos</TabsTrigger>
                <TabsTrigger value='confirmed'>Confirmados</TabsTrigger>
                <TabsTrigger value='pending'>Pendentes</TabsTrigger>
                <TabsTrigger value='completed'>Concluídos</TabsTrigger>
              </TabsList>

              <TabsContent value='all' className='space-y-4'>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onViewDetails={() => {
                        setSelectedAppointment(appointment)
                        setIsModalOpen(true)
                      }}
                    />
                  ))
                ) : (
                  <EmptyState message='Nenhum agendamento para esta data' />
                )}
              </TabsContent>

              <TabsContent value='confirmed' className='space-y-4'>
                {filteredAppointments.filter((a) => a.status === 'confirmed')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'confirmed')
                    .map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onViewDetails={() => {
                          setSelectedAppointment(appointment)
                          setIsModalOpen(true)
                        }}
                      />
                    ))
                ) : (
                  <EmptyState message='Nenhum agendamento confirmado para esta data' />
                )}
              </TabsContent>

              <TabsContent value='pending' className='space-y-4'>
                {filteredAppointments.filter((a) => a.status === 'pending')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'pending')
                    .map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onViewDetails={() => {
                          setSelectedAppointment(appointment)
                          setIsModalOpen(true)
                        }}
                      />
                    ))
                ) : (
                  <EmptyState message='Nenhum agendamento pendente para esta data' />
                )}
              </TabsContent>

              <TabsContent value='completed' className='space-y-4'>
                {filteredAppointments.filter((a) => a.status === 'completed')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'completed')
                    .map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onViewDetails={() => {
                          setSelectedAppointment(appointment)
                          setIsModalOpen(true)
                        }}
                      />
                    ))
                ) : (
                  <EmptyState message='Nenhum agendamento concluído para esta data' />
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
        onCancel={handleCancelAppointment}
      />
    </div>
  )
}

const AppointmentCard = ({
  appointment,
  onViewDetails,
}: {
  appointment: Appointment
  onViewDetails: () => void
}) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return ''
    }
  }

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelado'
      case 'completed':
        return 'Concluído'
      default:
        return ''
    }
  }

  return (
    <div className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'>
      <div className='flex items-start space-x-4'>
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
            <User className='h-5 w-5 text-gray-600' />
          </div>
        </div>
        <div>
          <h4 className='font-medium'>{appointment.clientName}</h4>
          <p className='text-sm text-gray-600'>{appointment.service}</p>
          <div className='flex items-center mt-1 text-sm text-gray-500'>
            <CalendarIcon className='h-3 w-3 mr-1' />
            <span>{appointment.date.toLocaleDateString('pt-BR')}</span>
            <Clock className='h-3 w-3 ml-3 mr-1' />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <Badge variant='outline' className={getStatusColor(appointment.status)}>
          {getStatusText(appointment.status)}
        </Badge>
        <Button variant='ghost' size='sm' onClick={onViewDetails}>
          Detalhes
        </Button>
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className='text-center py-8'>
    <p className='text-gray-500'>{message}</p>
  </div>
)

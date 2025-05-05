'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CalendarIcon,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { AppointmentDetailsModal } from './appointment-details-modal'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format, parseISO, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

enum PrismaAppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

enum AppointmentType {
  PRESENTIAL = 'PRESENTIAL',
  VIRTUAL = 'VIRTUAL',
}
type AppointmentStatus = PrismaAppointmentStatus | 'loading' | 'error'

type Appointment = {
  id: number
  clientId: number
  providerId: number
  serviceId: number
  clientName: string
  providerName: string
  serviceName: string
  date: Date
  time: string
  status: AppointmentStatus
  duration: number
  type: AppointmentType
}

interface ApiResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    lastPage: number
  }
}

export function ScheduleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    lastPage: 1,
  })

  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }

  const fetchAppointments = useCallback(
    async (page = 1, limit = 50) => {
      setIsLoading(true)
      const token = getToken()
      if (!token) {
        toast.error('Erro de autenticação. Faça login novamente.')
        setIsLoading(false)
        // Redirect to login?
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}appointments/my-appointments?page=${page}&limit=${limit}&upcomingOnly=false`, // Fetch all for now
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error('Sessão expirada ou inválida. Faça login novamente.')
            localStorage.removeItem('access_token')
            // redirect to login
          } else {
            throw new Error(
              `Failed to fetch appointments: ${response.statusText}`
            )
          }
          return
        }

        const result: ApiResponse<any> = await response.json()

        const mappedAppointments = result.data.map(
          (appointment: any): Appointment => {
            const appointmentDate = parseISO(appointment.date)
            return {
              id: appointment.id,
              clientId: appointment.clientId,
              providerId: appointment.providerId,
              serviceId: appointment.serviceId,
              clientName:
                appointment.client?.user?.name ?? 'Cliente Desconhecido',
              providerName:
                appointment.provider?.user?.name ?? 'Prestador Desconhecido',
              serviceName: appointment.service?.name ?? 'Serviço Desconhecido',
              date: appointmentDate,
              time: format(appointmentDate, 'HH:mm', { locale: ptBR }),
              status: appointment.status as PrismaAppointmentStatus,
              duration: appointment.service?.duration ?? 60,
              type: appointment.type ?? 'PRESENTIAL',
            }
          }
        )

        setAppointments(mappedAppointments)
        setPagination({
          page: result.meta.page,
          limit: result.meta.limit,
          total: result.meta.total,
          lastPage: result.meta.lastPage,
        })
      } catch (error: any) {
        toast.error(`Erro ao carregar agendamentos: ${error.message}`)
        console.error('Error fetching appointments:', error)
        setAppointments([])
      } finally {
        setIsLoading(false)
      }
    },
    [getToken]
  )

  useEffect(() => {
    fetchAppointments(pagination.page, pagination.limit)
  }, [fetchAppointments, pagination.page, pagination.limit])

  const filteredAppointments = appointments.filter((appointment) => {
    if (!date) return true
    const appointmentDay = startOfDay(appointment.date)
    const selectedDay = startOfDay(date)
    return appointmentDay.getTime() === selectedDay.getTime()
  })

  const handleUpdateStatus = async (
    id: number,
    status: PrismaAppointmentStatus
  ) => {
    setIsUpdating(id)
    const token = getToken()
    if (!token) {
      toast.error('Erro de autenticação. Faça login novamente.')
      setIsUpdating(null)
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message ||
            `Failed to update appointment status to ${status}`
        )
      }

      const updatedAppointmentData = await response.json()

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status:
                  updatedAppointmentData.status as PrismaAppointmentStatus,
              }
            : app
        )
      )

      toast.success(
        `Agendamento ${
          status === PrismaAppointmentStatus.CONFIRMED
            ? 'confirmado'
            : 'atualizado'
        } com sucesso!`
      )
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(`Erro ao atualizar agendamento: ${error.message}`)
      console.error('Error updating appointment:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleCancelAppointment = async (id: number) => {
    setIsUpdating(id)
    const token = getToken()
    if (!token) {
      toast.error('Erro de autenticação. Faça login novamente.')
      setIsUpdating(null)
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to cancel appointment')
      }

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: PrismaAppointmentStatus.CANCELLED }
            : app
        )
      )

      toast.success('Agendamento cancelado com sucesso!')
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(`Erro ao cancelar agendamento: ${error.message}`)
      console.error('Error cancelling appointment:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  // --- Calendar Modifiers ---
  const getDatesWithAppointments = () => {
    const dates: Record<string, Record<PrismaAppointmentStatus, number>> = {}
    appointments.forEach((appointment) => {
      const dateStr = format(appointment.date, 'yyyy-MM-dd')
      if (!dates[dateStr]) {
        dates[dateStr] = {
          PENDING: 0,
          CONFIRMED: 0,
          COMPLETED: 0,
          CANCELLED: 0,
          REJECTED: 0,
        }
      }
      if (
        appointment.status in PrismaAppointmentStatus &&
        dates[dateStr][appointment.status as PrismaAppointmentStatus] !==
          undefined
      ) {
        if (appointment.status in PrismaAppointmentStatus) {
          dates[dateStr][appointment.status as PrismaAppointmentStatus]++
        }
      }
    })
    return dates
  }

  const datesWithAppointments = getDatesWithAppointments()

  const calendarModifiers = {
    appointmentPending: (d: Date) =>
      datesWithAppointments[format(d, 'yyyy-MM-dd')]?.PENDING > 0,
    appointmentConfirmed: (d: Date) =>
      datesWithAppointments[format(d, 'yyyy-MM-dd')]?.CONFIRMED > 0,
    appointmentCompleted: (d: Date) =>
      datesWithAppointments[format(d, 'yyyy-MM-dd')]?.COMPLETED > 0,
    // Add other statuses if needed
  }

  const calendarModifiersStyles = {
    appointmentPending: { fontWeight: 'bold', color: '#F59E0B' }, // Yellow
    appointmentConfirmed: { fontWeight: 'bold', color: '#10B981' }, // Green
    appointmentCompleted: { fontWeight: 'bold', color: '#3B82F6' }, // Blue
    // Add styles for other statuses
  }

  // --- Loading State ---
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
              <div className='mt-4 space-y-2'>
                <Skeleton className='h-4 w-3/4' />{' '}
                <Skeleton className='h-4 w-1/2' />{' '}
                <Skeleton className='h-4 w-2/3' />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                Carregando Agendamentos...
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

  // --- Main Render ---
  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* Calendar Section */}
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
              className='rounded-md border p-0' // Adjust padding if needed
              locale={ptBR}
              modifiers={calendarModifiers}
              modifiersStyles={calendarModifiersStyles}
              footer={
                <div className='mt-4 space-y-1 px-3 pb-2 text-xs'>
                  <p className='flex items-center'>
                    <span className='w-2 h-2 rounded-full bg-yellow-500 mr-2'></span>{' '}
                    Pendente
                  </p>
                  <p className='flex items-center'>
                    <span className='w-2 h-2 rounded-full bg-green-500 mr-2'></span>{' '}
                    Confirmado
                  </p>
                  <p className='flex items-center'>
                    <span className='w-2 h-2 rounded-full bg-blue-500 mr-2'></span>{' '}
                    Concluído
                  </p>
                  {/* Add other status legends */}
                </div>
              }
            />
            {/* Monthly Summary (Optional) */}
            {/* ... summary code ... */}
          </CardContent>
        </Card>
      </div>

      {/* Appointments List Section */}
      <div className='md:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>
              Agendamentos{' '}
              {date ? `- ${format(date, 'PPP', { locale: ptBR })}` : ''}
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

              {(['all', 'CONFIRMED', 'PENDING', 'COMPLETED'] as const).map(
                (statusKey) => {
                  const statusFilter =
                    statusKey === 'all'
                      ? undefined
                      : (statusKey as PrismaAppointmentStatus)
                  const list = statusFilter
                    ? filteredAppointments.filter(
                        (a) => a.status === statusFilter
                      )
                    : filteredAppointments
                  const statusText = statusFilter
                    ? getStatusText(statusFilter).toLowerCase()
                    : 'para esta data'

                  return (
                    <TabsContent
                      key={statusKey}
                      value={statusKey}
                      className='space-y-4'
                    >
                      {list.length > 0 ? (
                        list.map((appointment) => (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            isLoading={isUpdating === appointment.id}
                            onViewDetails={() => {
                              setSelectedAppointment(appointment)
                              setIsModalOpen(true)
                            }}
                          />
                        ))
                      ) : (
                        <EmptyState
                          message={`Nenhum agendamento ${statusText}`}
                        />
                      )}
                    </TabsContent>
                  )
                }
              )}
            </Tabs>
            {/* Add Pagination Controls if lastPage > 1 */}
            {/* ... pagination UI ... */}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <AppointmentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        isLoading={!!isUpdating} // Pass general loading state to modal
        onConfirm={(id) =>
          handleUpdateStatus(id, PrismaAppointmentStatus.CONFIRMED)
        }
        onCancel={handleCancelAppointment}
        onComplete={(id) =>
          handleUpdateStatus(id, PrismaAppointmentStatus.COMPLETED)
        } // Add complete action
        onReject={(id) =>
          handleUpdateStatus(id, PrismaAppointmentStatus.REJECTED)
        } // Add reject action
      />
    </div>
  )
}

// --- Helper Components ---

const AppointmentCard = ({
  appointment,
  onViewDetails,
  isLoading,
}: {
  appointment: Appointment
  onViewDetails: () => void
  isLoading: boolean
}) => {
  const { statusColor, statusText, StatusIcon } = getStatusInfo(
    appointment.status
  )

  return (
    <div
      className={`relative flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isLoading ? 'opacity-50' : ''
      }`}
    >
      <div className='flex items-start space-x-4 flex-grow'>
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
            <User className='h-5 w-5 text-gray-600 dark:text-gray-300' />
          </div>
        </div>
        <div className='flex-grow'>
          <h4 className='font-medium text-gray-900 dark:text-gray-100'>
            {appointment.clientName}
          </h4>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {appointment.serviceName}
          </p>
          <div className='flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap'>
            <span className='flex items-center mr-3'>
              <CalendarIcon className='h-3 w-3 mr-1' />{' '}
              {format(appointment.date, 'dd/MM/yy')}
            </span>
            <span className='flex items-center'>
              <Clock className='h-3 w-3 mr-1' /> {appointment.time} (
              {appointment.duration} min)
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end ml-4 space-y-2'>
        <Badge
          variant='outline'
          className={`border ${statusColor} ${statusColor
            .replace('bg-', 'text-')
            .replace('-100', '-800')} dark:${statusColor
            .replace('bg-', 'text-')
            .replace('-100', '-300')} dark:border-opacity-50`}
        >
          <StatusIcon className='h-3 w-3 mr-1' />
          {statusText}
        </Badge>
        <Button
          variant='ghost'
          size='sm'
          onClick={onViewDetails}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            'Detalhes'
          )}
        </Button>
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className='text-center py-10 px-4 border-2 border-dashed rounded-lg'>
    <CalendarIcon className='mx-auto h-10 w-10 text-gray-400' />
    <p className='mt-2 text-sm text-gray-500'>{message}</p>
  </div>
)

// --- Status Mapping ---

const getStatusInfo = (
  status: AppointmentStatus
): {
  statusColor: string
  statusText: string
  StatusIcon: React.ElementType
} => {
  switch (status) {
    case PrismaAppointmentStatus.CONFIRMED:
      return {
        statusColor: 'bg-green-100 border-green-200',
        statusText: 'Confirmado',
        StatusIcon: CheckCircle,
      }
    case PrismaAppointmentStatus.PENDING:
      return {
        statusColor: 'bg-yellow-100 border-yellow-200',
        statusText: 'Pendente',
        StatusIcon: Clock,
      }
    case PrismaAppointmentStatus.CANCELLED:
      return {
        statusColor: 'bg-red-100 border-red-200',
        statusText: 'Cancelado',
        StatusIcon: XCircle,
      }
    case PrismaAppointmentStatus.COMPLETED:
      return {
        statusColor: 'bg-blue-100 border-blue-200',
        statusText: 'Concluído',
        StatusIcon: CheckCircle,
      } // Or a different icon?
    case PrismaAppointmentStatus.REJECTED:
      return {
        statusColor: 'bg-red-100 border-red-200',
        statusText: 'Rejeitado',
        StatusIcon: XCircle,
      }
    case 'loading':
      return {
        statusColor: 'bg-gray-100 border-gray-200',
        statusText: 'Atualizando...',
        StatusIcon: Loader2,
      }
    default:
      return {
        statusColor: 'bg-gray-100 border-gray-200',
        statusText: 'Desconhecido',
        StatusIcon: AlertCircle,
      }
  }
}

const getStatusText = (status: PrismaAppointmentStatus): string => {
  return getStatusInfo(status).statusText
}


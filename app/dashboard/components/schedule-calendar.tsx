'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, User } from 'lucide-react'
import { AppointmentDetailsModal } from './appointment-details-modal'

type Appointment = {
  id: string
  clientName: string
  service: string
  date: Date
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'João Silva',
    service: 'Consultoria Fiscal',
    date: new Date(2025, 3, 22, 10, 0),
    time: '10:00',
    status: 'confirmed',
  },
  {
    id: '2',
    clientName: 'Maria Oliveira',
    service: 'Planejamento Financeiro',
    date: new Date(2025, 3, 22, 14, 30),
    time: '14:30',
    status: 'pending',
  },
  {
    id: '3',
    clientName: 'Pedro Santos',
    service: 'Declaração de Imposto',
    date: new Date(2025, 3, 23, 9, 0),
    time: '09:00',
    status: 'confirmed',
  },
  {
    id: '4',
    clientName: 'Ana Costa',
    service: 'Consultoria Empresarial',
    date: new Date(2025, 3, 24, 16, 0),
    time: '16:00',
    status: 'cancelled',
  },
  {
    id: '5',
    clientName: 'Roberto Almeida',
    service: 'Análise Financeira',
    date: new Date(2025, 3, 25, 11, 0),
    time: '11:00',
    status: 'confirmed',
  },
  {
    id: '6',
    clientName: 'Juliana Santos',
    service: 'Consultoria Tributária',
    date: new Date(2025, 3, 26, 15, 0),
    time: '15:00',
    status: 'pending',
  },
]

export function ScheduleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredAppointments = mockAppointments.filter((appointment) => {
    if (!date) return true
    return (
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    )
  })

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return ''
    }
  }

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return ''
    }
  }

  // Function to get dates with appointments for highlighting in calendar
  const getDatesWithAppointments = () => {
    const dates: Record<
      string,
      { confirmed: number; pending: number; cancelled: number }
    > = {}

    mockAppointments.forEach((appointment) => {
      const dateStr = appointment.date.toDateString()
      if (!dates[dateStr]) {
        dates[dateStr] = { confirmed: 0, pending: 0, cancelled: 0 }
      }
      dates[dateStr][appointment.status]++
    })

    return dates
  }

  const datesWithAppointments = getDatesWithAppointments()

  return (
    <div className='grid gap-6 md:grid-cols-3'>
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
            </div>

            <div className='mt-6'>
              <h3 className='text-sm font-medium mb-2'>Resumo do Mês</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-green-600'>
                    12
                  </span>
                  <span className='text-xs text-gray-500'>Confirmados</span>
                </div>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-yellow-600'>
                    5
                  </span>
                  <span className='text-xs text-gray-500'>Pendentes</span>
                </div>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-red-600'>
                    2
                  </span>
                  <span className='text-xs text-gray-500'>Cancelados</span>
                </div>
                <div className='bg-gray-50 p-3 rounded-md text-center'>
                  <span className='block text-2xl font-bold text-blue-600'>
                    19
                  </span>
                  <span className='text-xs text-gray-500'>Total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='md:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>
              Agendamentos {date && `- ${date.toLocaleDateString('pt-BR')}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='all'>
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
                            {appointment.clientName}
                          </h4>
                          <p className='text-sm text-gray-600'>
                            {appointment.service}
                          </p>
                          <div className='flex items-center mt-1 text-sm text-gray-500'>
                            <CalendarIcon className='h-3 w-3 mr-1' />
                            <span>
                              {appointment.date.toLocaleDateString('pt-BR')}
                            </span>
                            <Clock className='h-3 w-3 ml-3 mr-1' />
                            <span>{appointment.time}</span>
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
                {filteredAppointments.filter((a) => a.status === 'confirmed')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'confirmed')
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
                              {appointment.clientName}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {appointment.service}
                            </p>
                            <div className='flex items-center mt-1 text-sm text-gray-500'>
                              <CalendarIcon className='h-3 w-3 mr-1' />
                              <span>
                                {appointment.date.toLocaleDateString('pt-BR')}
                              </span>
                              <Clock className='h-3 w-3 ml-3 mr-1' />
                              <span>{appointment.time}</span>
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
                {filteredAppointments.filter((a) => a.status === 'pending')
                  .length > 0 ? (
                  filteredAppointments
                    .filter((a) => a.status === 'pending')
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
                              {appointment.clientName}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {appointment.service}
                            </p>
                            <div className='flex items-center mt-1 text-sm text-gray-500'>
                              <CalendarIcon className='h-3 w-3 mr-1' />
                              <span>
                                {appointment.date.toLocaleDateString('pt-BR')}
                              </span>
                              <Clock className='h-3 w-3 ml-3 mr-1' />
                              <span>{appointment.time}</span>
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

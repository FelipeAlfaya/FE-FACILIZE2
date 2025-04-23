'use client'

import { useState } from 'react'
import { CalendarIcon, Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { AppointmentDetailsModal } from '../../components/appointment-details-modal'

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
]

export function ProviderDashboard() {
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
              selected={date}
              onSelect={setDate}
              className='rounded-md border'
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
          </CardContent>
        </Card>
      </div>

      <div className='md:col-span-2'>
        <Card className='bg-card text-card-foreground'>
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

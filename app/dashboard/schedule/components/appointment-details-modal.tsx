'use client'

import { useState } from 'react'
import {
  X,
  CalendarIcon,
  Clock,
  User,
  CheckCircle,
  XCircle,
  MapPin,
  Video,
  Phone,
  Mail,
  PhoneCall,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '@/types/appointment'

type AppointmentDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  if (!appointment) return null

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

  const getClientInfo = () => {
    if (!appointment) return { name: '', email: null, phone: null }

    if (appointment.isProviderToProvider) {
      return {
        name: appointment.User?.name || 'Outro Provedor',
        email: appointment.User?.email || null,
        phone: appointment.User?.phone || null,
      }
    }

    return {
      name: appointment.client?.user?.name || 'Cliente não encontrado',
      email: appointment.client?.user?.email || null,
      phone: appointment.client?.user?.phone || null,
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

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className='h-5 w-5 text-emerald-600' />
      case 'PENDING':
        return <Clock className='h-5 w-5 text-yellow-600' />
      case 'CANCELLED':
        return <XCircle className='h-5 w-5 text-red-600' />
      case 'COMPLETED':
        return <CheckCircle className='h-5 w-5 text-blue-600' />
      default:
        return null
    }
  }

  const getAppointmentTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'PRESENTIAL':
        return <MapPin className='h-5 w-5 text-blue-600' />
      case 'VIRTUAL':
        return <Video className='h-5 w-5 text-blue-600' />
      case 'NOT_SPECIFIED':
        return <Phone className='h-5 w-5 text-blue-600' />
      default:
        return <CalendarIcon className='h-5 w-5 text-blue-600' />
    }
  }

  const getAppointmentTypeText = (type: AppointmentType) => {
    switch (type) {
      case 'PRESENTIAL':
        return 'Presencial'
      case 'VIRTUAL':
        return 'Videoconferência'
      case 'NOT_SPECIFIED':
        return 'Telefone'
      default:
        return 'Não especificado'
    }
  }

  const handleConfirm = () => {
    if (appointment.status !== 'PENDING') return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset and close after showing success
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  const getSuccessMessage = () => {
    const clientInfo = getClientInfo()
    return `O agendamento com ${clientInfo.name} foi confirmado com sucesso.`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className='py-6 text-center'>
            <div className='w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-lg font-medium mb-2'>
              Agendamento Confirmado!
            </h3>
            <p className='text-gray-600'>{getSuccessMessage()}</p>
          </div>
        ) : (
          <>
            <div className='py-4'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    <User className='h-5 w-5 text-gray-600' />
                  </div>
                  <div className='ml-3'>
                    <h3 className='font-medium'>{getClientInfo().name}</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {appointment.service.name}
                    </p>
                    {appointment.isProviderToProvider && (
                      <Badge variant='secondary' className='mt-1'>
                        Provedor para Provedor
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge
                  variant='outline'
                  className={getStatusColor(appointment.status)}
                >
                  {getStatusText(appointment.status)}
                </Badge>
              </div>

              <div className='space-y-4'>
                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    <CalendarIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Data</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {format(
                        appointment.date,
                        "EEEE, dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    <Clock className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Horário</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    {getAppointmentTypeIcon(appointment.type)}
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Tipo</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {getAppointmentTypeText(appointment.type)}
                    </p>
                  </div>
                </div>

                {appointment.location && (
                  <div className='flex items-start'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                      <MapPin className='h-4 w-4 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Local</p>
                      <p className='text-sm text-gray-600'>
                        {appointment.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    {getStatusIcon(appointment.status)}
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Status</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {getStatusText(appointment.status)}
                    </p>
                  </div>
                </div>

                {appointment.client?.user?.email && (
                  <div className='flex items-start'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                      <Mail className='h-4 w-4 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Email</p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {appointment.client?.user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {appointment.client?.user?.phone && (
                  <div className='flex items-start'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                      <PhoneCall className='h-4 w-4 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Telefone</p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {appointment.client.user.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <div className='mt-6 p-3 bg-muted rounded-md'>
                  <p className='text-sm font-medium mb-2 dark:text-gray-400'>
                    Notas
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-500'>
                    {appointment.notes}
                  </p>
                </div>
              )}

              {getClientInfo().email && (
                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    <Mail className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Email</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {getClientInfo().email}
                    </p>
                  </div>
                </div>
              )}

              {getClientInfo().phone && (
                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    <PhoneCall className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Telefone</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {getClientInfo().phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {appointment.status === 'PENDING' && (
                <>
                  <Button variant='outline' onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className='bg-emerald-600 hover:bg-emerald-700'
                  >
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                  </Button>
                </>
              )}

              {appointment.status === 'CONFIRMED' && (
                <>
                  <Button variant='outline' onClick={onClose}>
                    Fechar
                  </Button>
                  <Button className='bg-emerald-600 hover:bg-emerald-700'>
                    Marcar como Concluído
                  </Button>
                </>
              )}

              {(appointment.status === 'CANCELLED' ||
                appointment.status === 'COMPLETED') && (
                <Button onClick={onClose}>Fechar</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}


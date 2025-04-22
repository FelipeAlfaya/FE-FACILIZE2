'use client'

import { useState } from 'react'
import {
  X,
  CalendarIcon,
  Clock,
  User,
  CheckCircle,
  XCircle,
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

type Appointment = {
  id: string
  clientName: string
  service: string
  date: Date
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

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

  if (!appointment) return null

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

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-600' />
      case 'cancelled':
        return <XCircle className='h-5 w-5 text-red-600' />
      default:
        return null
    }
  }

  const handleConfirm = () => {
    if (appointment.status !== 'pending') return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>

        {isSuccess ? (
          <div className='py-6 text-center'>
            <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='h-6 w-6 text-green-600' />
            </div>
            <h3 className='text-lg font-medium mb-2'>
              Agendamento Confirmado!
            </h3>
            <p className='text-gray-600'>
              O agendamento com {appointment.clientName} foi confirmado com
              sucesso.
            </p>
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
                    <h3 className='font-medium'>{appointment.clientName}</h3>
                    <p className='text-sm text-gray-600'>
                      {appointment.service}
                    </p>
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
                    <p className='text-sm text-gray-600'>
                      {appointment.date.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    <Clock className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Horário</p>
                    <p className='text-sm text-gray-600'>{appointment.time}</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    {getStatusIcon(appointment.status)}
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Status</p>
                    <p className='text-sm text-gray-600'>
                      {getStatusText(appointment.status)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-6 p-3 bg-gray-50 rounded-md'>
                <p className='text-sm font-medium mb-2'>Notas</p>
                <p className='text-sm text-gray-600'>
                  {appointment.status === 'pending'
                    ? 'Este agendamento está aguardando sua confirmação.'
                    : appointment.status === 'confirmed'
                    ? 'Este agendamento foi confirmado e está agendado.'
                    : 'Este agendamento foi cancelado.'}
                </p>
              </div>
            </div>

            <DialogFooter>
              {appointment.status === 'pending' && (
                <>
                  <Button variant='outline' onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirm} disabled={isSubmitting}>
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                  </Button>
                </>
              )}

              {appointment.status !== 'pending' && (
                <Button onClick={onClose}>Fechar</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import {
  X,
  CalendarIcon,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Check,
  Loader2,
  AlertCircle,
  Building,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
  status: PrismaAppointmentStatus
  duration: number
  type: 'VIRTUAL' | 'PRESENTIAL'
}

type AppointmentDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
  isLoading: boolean
  onConfirm: (id: number) => Promise<void>
  onCancel: (id: number) => Promise<void>
  onComplete: (id: number) => Promise<void>
  onReject: (id: number) => Promise<void>
}

const getStatusInfo = (
  status: PrismaAppointmentStatus
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
      }
    case PrismaAppointmentStatus.REJECTED:
      return {
        statusColor: 'bg-red-100 border-red-200',
        statusText: 'Rejeitado',
        StatusIcon: XCircle,
      }
    default:
      return {
        statusColor: 'bg-gray-100 border-gray-200',
        statusText: 'Desconhecido',
        StatusIcon: AlertCircle,
      }
  }
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  isLoading,
  onConfirm,
  onCancel,
  onComplete,
  onReject,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null

  const { statusColor, statusText, StatusIcon } = getStatusInfo(
    appointment.status
  )

  const isProvider = true
  const isClient = false

  const handleAction = async (action: (id: number) => Promise<void>) => {
    await action(appointment.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        {' '}
        {/* Increased width slightly */}
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
          <DialogDescription>
            Revise as informações do agendamento e tome as ações necessárias.
          </DialogDescription>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
            onClick={onClose}
            aria-label='Fechar'
          >
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>
        <div className='py-4 grid gap-4'>
          {/* Status Badge */}
          <div className='flex justify-end'>
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
          </div>

          {/* Client Info */}
          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3'>
              <User className='h-4 w-4 text-gray-600 dark:text-gray-300' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                Cliente
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {appointment.clientName}
              </p>
            </div>
          </div>

          {/* Provider Info */}
          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3'>
              <Building className='h-4 w-4 text-gray-600 dark:text-gray-300' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                Prestador
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {appointment.providerName}
              </p>
            </div>
          </div>

          {/* Service Info */}
          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3'>
              <Briefcase className='h-4 w-4 text-gray-600 dark:text-gray-300' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                Serviço
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {appointment.serviceName} ({appointment.duration} min)
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3'>
              <CalendarIcon className='h-4 w-4 text-blue-600 dark:text-blue-300' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                Data e Hora
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {format(appointment.date, "EEEE, dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}{' '}
                às {appointment.time}
              </p>
            </div>
          </div>

          {/* Appointment Type */}
          <div className='flex items-start'>
            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3'>
              {/* Choose an icon for type */}
              <Briefcase className='h-4 w-4 text-purple-600 dark:text-purple-300' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                Tipo
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {appointment.type === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className='sm:justify-between gap-2 flex-wrap'>
          {' '}
          {/* Adjust footer layout */}
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Fechar
          </Button>
          <div className='flex gap-2 flex-wrap justify-end'>
            {' '}
            {/* Group action buttons */}
            {/* Provider Actions */}
            {isProvider &&
              appointment.status === PrismaAppointmentStatus.PENDING && (
                <>
                  <Button
                    variant='destructive'
                    onClick={() => handleAction(onReject)}
                    disabled={isLoading}
                    size='sm'
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <XCircle className='h-4 w-4 mr-2' />
                    )}{' '}
                    Rejeitar
                  </Button>
                  <Button
                    onClick={() => handleAction(onConfirm)}
                    disabled={isLoading}
                    size='sm'
                    className='bg-green-600 hover:bg-green-700'
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <CheckCircle className='h-4 w-4 mr-2' />
                    )}{' '}
                    Confirmar
                  </Button>
                </>
              )}
            {isProvider &&
              appointment.status === PrismaAppointmentStatus.CONFIRMED && (
                <Button
                  onClick={() => handleAction(onComplete)}
                  disabled={isLoading}
                  size='sm'
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  {isLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  ) : (
                    <Check className='h-4 w-4 mr-2' />
                  )}{' '}
                  Marcar como Concluído
                </Button>
              )}
            {/* Client/Provider Cancel Action (if applicable) */}
            {(isClient || isProvider) &&
              [
                PrismaAppointmentStatus.PENDING,
                PrismaAppointmentStatus.CONFIRMED,
              ].includes(appointment.status) && (
                // Add logic here to check if cancellation is allowed based on time (e.g., > 48h)
                // const canCancel = isCancellationAllowed(appointment.date);
                // For now, always show if status allows
                <Button
                  variant='destructive'
                  onClick={() => handleAction(onCancel)}
                  disabled={isLoading} // || !canCancel
                  size='sm'
                >
                  {isLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  ) : (
                    <XCircle className='h-4 w-4 mr-2' />
                  )}{' '}
                  Cancelar Agendamento
                </Button>
              )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


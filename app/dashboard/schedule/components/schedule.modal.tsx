'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, Clock, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from '@/components/ui/use-toast'
import { TransformedProvider } from '@/types/appointment'

type ScheduleModalProps = {
  isOpen: boolean
  onClose: () => void
  provider: TransformedProvider | null
  onSuccess?: () => void
}

export function ScheduleModal({
  isOpen,
  onClose,
  provider,
  onSuccess,
}: ScheduleModalProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  useEffect(() => {
    const fetchAvailability = async () => {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (date && provider) {
        try {
          console.log(`${date.toISOString()}, ${provider.id}`)
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}appointments/provider/${
              provider.id
            }/availability?date=${date.toISOString()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!response.ok) {
            throw new Error('Erro ao buscar horários disponíveis')
          }

          const slots = await response.json()
          setAvailableSlots(slots)
          setTime('')
        } catch (error) {
          console.error('Error fetching availability:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os horários disponíveis',
            variant: 'destructive',
          })
        }
      }
    }

    fetchAvailability()
  }, [date, provider])

  const handleSubmit = async () => {
    if (!date || !time || !selectedService || !provider) return

    setIsSubmitting(true)

    try {
      const service = provider.services.find((s) => s.id === selectedService)
      if (!service) {
        throw new Error('Serviço não encontrado')
      }

      // Calcular endTime baseado na duração do serviço
      const [hours, minutes] = time.split(':').map(Number)
      const endTime = new Date(date)
      endTime.setHours(hours, minutes + service.duration)

      const endTimeString = `${endTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`

      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            providerId: provider.id,
            serviceId: selectedService,
            date,
            startTime: time,
            endTime: endTimeString,
            type: 'PRESENTIAL', // ou 'VIRTUAL' se for o caso
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao criar agendamento')
      }

      setIsSuccess(true)
      if (onSuccess) onSuccess()

      // Fechar o modal após 2 segundos
      setTimeout(() => {
        setIsSuccess(false)
        setDate(undefined)
        setTime('')
        setSelectedService(null)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o agendamento',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!provider) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Agendar com {provider.name}</DialogTitle>
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
              Seu agendamento com {provider.name} foi confirmado para{' '}
              {date && format(date, "dd 'de' MMMM", { locale: ptBR })} às {time}
              .
            </p>
          </div>
        ) : (
          <>
            <div className='grid gap-4 py-4'>
              {/* Seleção de Serviço */}
              <div className='grid gap-2'>
                <label className='text-sm font-medium'>
                  Selecione um serviço
                </label>
                <div className='grid gap-2'>
                  {provider.services.map((service) => (
                    <Button
                      key={service.id}
                      variant={
                        selectedService === service.id ? 'default' : 'outline'
                      }
                      className='justify-start text-left'
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className='flex flex-col items-start'>
                        <span>{service.name}</span>
                        <span className='text-sm text-gray-400'>
                          {service.duration} min - R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Seleção de Data */}
              <div className='grid gap-2'>
                <label className='text-sm font-medium'>
                  Selecione uma data
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'justify-start text-left font-normal',
                        !date && 'text-gray-400'
                      )}
                      disabled={!selectedService}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {date
                        ? format(date, "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                      disabled={
                        (date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date.getDay() === 0 || // Domingo
                          date.getDay() === 6 // Sábado
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Seleção de Horário */}
              {date && (
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>
                    Selecione um horário
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'justify-start text-left font-normal',
                          !time && 'text-gray-400'
                        )}
                        disabled={!date || availableSlots.length === 0}
                      >
                        <Clock className='mr-2 h-4 w-4' />
                        {time ? time : 'Selecione um horário'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-48 p-0'>
                      <div className='grid grid-cols-2 gap-2 p-2'>
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant='ghost'
                            className={cn(
                              'justify-start text-left font-normal',
                              time === slot && 'bg-blue-100 text-blue-600'
                            )}
                            onClick={() => setTime(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Resumo do Agendamento */}
              {selectedService && (
                <div className='mt-2'>
                  <h4 className='text-sm font-medium mb-2'>
                    Resumo do Agendamento
                  </h4>
                  <div className='p-3 rounded-md'>
                    <div className='flex justify-between mb-2'>
                      <span className='text-sm text-gray-600'>
                        Profissional:
                      </span>
                      <span className='text-sm font-medium'>
                        {provider.name}
                      </span>
                    </div>
                    <div className='flex justify-between mb-2'>
                      <span className='text-sm text-gray-600'>Serviço:</span>
                      <span className='text-sm font-medium'>
                        {
                          provider.services.find(
                            (s) => s.id === selectedService
                          )?.name
                        }
                      </span>
                    </div>
                    <div className='flex justify-between mb-2'>
                      <span className='text-sm text-gray-600'>Duração:</span>
                      <span className='text-sm font-medium'>
                        {
                          provider.services.find(
                            (s) => s.id === selectedService
                          )?.duration
                        }{' '}
                        minutos
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Valor:</span>
                      <span className='text-sm font-medium'>
                        R${' '}
                        {provider.services
                          .find((s) => s.id === selectedService)
                          ?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant='outline' onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!date || !time || !selectedService || isSubmitting}
              >
                {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}


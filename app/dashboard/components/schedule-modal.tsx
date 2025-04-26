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

type Provider = {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  services: number
  price: number
}

type ScheduleModalProps = {
  isOpen: boolean
  onClose: () => void
  provider: Provider | null
}

const mockAvailability = {
  '2023-05-15': ['09:00', '10:00', '11:00', '14:00', '15:00'],
  '2023-05-16': ['08:00', '09:00', '10:00', '13:00', '14:00'],
  '2023-05-17': ['11:00', '13:00', '14:00', '15:00', '16:00'],
  '2023-05-18': ['09:00', '10:00', '11:00', '15:00', '16:00'],
  '2023-05-19': ['08:00', '09:00', '13:00', '14:00', '15:00'],
}

export function ScheduleModal({
  isOpen,
  onClose,
  provider,
}: ScheduleModalProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [availability, setAvailability] =
    useState<Record<string, string[]>>(mockAvailability)

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!provider) return

      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${provider.id}/availability`)
        // const data = await response.json()
        // setAvailability(data)

        setAvailability(mockAvailability)
      } catch (error) {
        console.error('Error fetching provider availability:', error)
      }
    }

    fetchAvailability()
  }, [provider])

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const slots = availability[formattedDate] || []
      setAvailableSlots(slots)
      setTime('')
    } else {
      setAvailableSlots([])
      setTime('')
    }
  }, [date, availability])

  const handleSubmit = () => {
    if (!date || !time) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        setDate(undefined)
        setTime('')
        onClose()
      }, 2000)
    }, 1500)
  }

  if (!provider) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Agendar com {provider.name}</DialogTitle>
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
              Seu agendamento com {provider.name} foi confirmado para{' '}
              {date && format(date, "dd 'de' MMMM", { locale: ptBR })} às {time}
              .
            </p>
          </div>
        ) : (
          <>
            <div className='grid gap-4 py-4'>
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
                      disabled={(date) => {
                        const formattedDate = format(date, 'yyyy-MM-dd')
                        return (
                          !availability[formattedDate] ||
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date.getDay() === 0 ||
                          date.getDay() === 6
                        )
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {date && availableSlots.length > 0 && (
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>
                    Selecione um horário
                  </label>
                  <div className='grid grid-cols-3 gap-2'>
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        type='button'
                        variant={time === slot ? 'default' : 'outline'}
                        className={cn(
                          'h-10',
                          time === slot && 'bg-primary text-primary-foreground'
                        )}
                        onClick={() => setTime(slot)}
                      >
                        <Clock className='mr-2 h-4 w-4' />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {date && availableSlots.length === 0 && (
                <div className='text-center py-4 text-muted-foreground'>
                  Não há horários disponíveis para esta data.
                </div>
              )}

              <div className='mt-2'>
                <h4 className='text-sm font-medium mb-2'>
                  Detalhes do serviço
                </h4>
                <div className='bg-gray-50 p-3 rounded-md'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm text-gray-600'>Profissional:</span>
                    <span className='text-sm font-medium'>{provider.name}</span>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm text-gray-600'>
                      Especialidade:
                    </span>
                    <span className='text-sm font-medium'>
                      {provider.specialty}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Valor:</span>
                    <span className='text-sm font-medium'>
                      R${provider.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant='outline' onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!date || !time || isSubmitting}
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

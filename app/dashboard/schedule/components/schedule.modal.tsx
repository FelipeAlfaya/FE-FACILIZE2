'use client'

import { useState } from 'react'
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

const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

export function ScheduleModal({
  isOpen,
  onClose,
  provider,
}: ScheduleModalProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        date.getDay() === 0 ||
                        date.getDay() === 6
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

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
                      disabled={!date}
                    >
                      <Clock className='mr-2 h-4 w-4' />
                      {time ? time : 'Selecione um horário'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-48 p-0'>
                    <div className='grid grid-cols-2 gap-2 p-2'>
                      {timeSlots.map((slot) => (
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

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
import { toast } from '@/hooks/use-toast'
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
  // Debug: Console log para verificar os IDs
  useEffect(() => {
    if (provider) {
      console.log('DEBUG - ScheduleModal recebeu provider com IDs:', {
        userId: provider.id,
        providerId: provider.providerId,
      })
    }
  }, [provider])

  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  function formatDate(receivedDate: Date | undefined) {
    if (!receivedDate) return null
    // Usar formato YYYY-MM-DD para evitar problemas com timezone
    return receivedDate.toISOString().split('T')[0]
  }

  const formattedDate = formatDate(date)
  console.log('formatted date', formattedDate)

  // Ao selecionar uma nova data ou serviço, resetar o horário selecionado
  useEffect(() => {
    setTime('')
  }, [date])

  useEffect(() => {
    const fetchAvailability = async () => {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (date && provider) {
        try {
          setIsLoadingSlots(true)
          // Formatar a data como YYYY-MM-DD para API
          const formattedDateForAPI = date.toISOString().split('T')[0]
          console.log(
            `DEBUG - Buscando disponibilidade para: ${formattedDateForAPI}, userId: ${provider.id}, providerId: ${provider.providerId}`
          )

          // Se você for o usuário com ID 4 (admin), use o providerId 1
          // Esta é uma solução temporária até que o backend seja corrigido
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
          const currentUserId = userInfo.id

          console.log(`DEBUG - Current user ID: ${currentUserId}`)

          // Determine qual providerId usar
          let targetProviderId = provider.providerId

          // Se o usuário logado é o admin (ID 4), use o providerId 1
          if (
            (currentUserId === 4 || currentUserId === '4') &&
            provider.id === '4'
          ) {
            console.log('DEBUG - Admin detectado, usando providerId=1')
            targetProviderId = 1
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}appointments/provider/${targetProviderId}/availability?date=${formattedDateForAPI}`,
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

          if (slots && Array.isArray(slots)) {
            console.log(`Recebidos ${slots.length} slots disponíveis:`, slots)
            setAvailableSlots(slots)
          } else {
            console.error('Formato de resposta inválido:', slots)
            setAvailableSlots([])
          }

          setTime('')
        } catch (error) {
          console.error('Error fetching availability:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os horários disponíveis',
            variant: 'destructive',
          })
          setAvailableSlots([])
        } finally {
          setIsLoadingSlots(false)
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

      // Criar uma data com o horário selecionado
      const startDateTime = new Date(date)
      startDateTime.setHours(hours, minutes, 0, 0)

      // Adicionar a duração do serviço em minutos para obter o horário final
      const endDateTime = new Date(startDateTime)
      endDateTime.setMinutes(endDateTime.getMinutes() + service.duration)

      // Formatar os horários como strings HH:MM
      const startTimeString = time // já está no formato correto
      const endTimeString = `${endDateTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${endDateTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`

      console.log(
        `Calculado horário final: ${startTimeString} + ${service.duration}min = ${endTimeString}`
      )

      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')

      // Formato da data para API: YYYY-MM-DD
      const dateFormatted = date.toISOString().split('T')[0]

      // Determine qual providerId usar
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
      const currentUserId = userInfo.id
      let targetProviderId = provider.providerId

      // Se o usuário logado é o admin (ID 4), use o providerId 1
      if (
        (currentUserId === 4 || currentUserId === '4') &&
        provider.id === '4'
      ) {
        console.log(
          'DEBUG - Admin detectado, usando providerId=1 para agendamento'
        )
        targetProviderId = 1
      }

      const requestBody = {
        providerId: targetProviderId,
        serviceId: Number(selectedService),
        date: dateFormatted, // Usar formato YYYY-MM-DD
        startTime: time,
        endTime: endTimeString,
        type: 'PRESENTIAL',
        location,
        notes,
      }

      console.log('Request payload:', requestBody)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      )

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(
          `Erro ao criar agendamento: ${
            responseData.message || JSON.stringify(responseData)
          }`
        )
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
              {location && ` no ${location}`}.
            </p>
          </div>
        ) : (
          <>
            <div className='grid gap-4 py-4'>
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
                        disabled={!date || isLoadingSlots}
                      >
                        {isLoadingSlots ? (
                          <div className='flex items-center'>
                            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent'></div>
                            <span>Carregando...</span>
                          </div>
                        ) : (
                          <>
                            <Clock className='mr-2 h-4 w-4' />
                            {time ? time : 'Selecione um horário'}
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-48 p-0'>
                      {availableSlots.length > 0 ? (
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
                      ) : (
                        <div className='p-4 text-center'>
                          <p className='text-sm text-gray-500'>
                            Não há horários disponíveis para esta data.
                          </p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  {date && availableSlots.length === 0 && !isLoadingSlots && (
                    <p className='text-xs text-amber-500 mt-1'>
                      Não há horários disponíveis para esta data. Por favor,
                      selecione outra data.
                    </p>
                  )}
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

                    <div className='grid gap-2'>
                      <label className='text-sm font-medium'>
                        Local do Atendimento
                      </label>
                      <input
                        type='text'
                        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'
                        placeholder='Ex: Escritório Central'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div className='grid gap-2'>
                      <label className='text-sm font-medium'>Observações</label>
                      <textarea
                        className='flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'
                        placeholder='Adicione informações importantes sobre o agendamento'
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
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

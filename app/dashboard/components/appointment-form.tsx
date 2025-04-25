'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2, CalendarIcon, Clock } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const mockServices = [
  { id: '1', name: 'Consulta Padrão', duration: 30, price: 150 },
  { id: '2', name: 'Consulta Detalhada', duration: 60, price: 250 },
  { id: '3', name: 'Avaliação Inicial', duration: 45, price: 200 },
  { id: '4', name: 'Retorno', duration: 20, price: 100 },
]

const mockAvailability = {
  '2023-05-15': ['09:00', '10:00', '11:00', '14:00', '15:00'],
  '2023-05-16': ['08:00', '09:00', '10:00', '13:00', '14:00'],
  '2023-05-17': ['11:00', '13:00', '14:00', '15:00', '16:00'],
  '2023-05-18': ['09:00', '10:00', '11:00', '15:00', '16:00'],
  '2023-05-19': ['08:00', '09:00', '13:00', '14:00', '15:00'],
}

interface AppointmentFormProps {
  providerId: string
}

export function AppointmentForm({ providerId }: AppointmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState(mockServices)
  const [selectedService, setSelectedService] = useState('')
  const [appointmentType, setAppointmentType] = useState('presential')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [availability, setAvailability] =
    useState<Record<string, string[]>>(mockAvailability)

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${providerId}`)
        // const data = await response.json()
        // setServices(data.services)
        // setAvailability(data.availability)

        setServices(mockServices)
        setAvailability(mockAvailability)
      } catch (error) {
        console.error('Error fetching provider data:', error)
      }
    }

    fetchProviderData()
  }, [providerId])

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const slots = availability[formattedDate] || []
      setAvailableSlots(slots)
      setSelectedTime('')
    } else {
      setAvailableSlots([])
      setSelectedTime('')
    }
  }, [date, availability])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService || !date || !selectedTime) {
      return
    }

    setIsLoading(true)

    try {
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     providerId,
      //     serviceId: selectedService,
      //     type: appointmentType,
      //     date: format(date, 'yyyy-MM-dd'),
      //     time: selectedTime
      //   })
      // })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push('/dashboard/schedule?success=true')
    } catch (error) {
      console.error('Error creating appointment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Agendar Consulta</CardTitle>
        <CardDescription>
          Preencha os detalhes para agendar sua consulta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='service'>Serviço</Label>
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
              required
            >
              <SelectTrigger id='service'>
                <SelectValue placeholder='Selecione um serviço' />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.duration}min - R${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Tipo de Consulta</Label>
            <RadioGroup
              value={appointmentType}
              onValueChange={setAppointmentType}
              className='flex space-x-4'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='presential' id='presential' />
                <Label htmlFor='presential'>Presencial</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='remote' id='remote' />
                <Label htmlFor='remote'>Remoto</Label>
              </div>
            </RadioGroup>
          </div>

          <div className='space-y-2'>
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date
                    ? format(date, 'PPP', { locale: ptBR })
                    : 'Selecione uma data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  disabled={(date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd')
                    return (
                      !(formattedDate in availability) ||
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    )
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {date && availableSlots.length > 0 && (
            <div className='space-y-2'>
              <Label>Horário</Label>
              <div className='grid grid-cols-3 gap-2'>
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    type='button'
                    variant={selectedTime === time ? 'default' : 'outline'}
                    className={cn(
                      'h-10',
                      selectedTime === time &&
                        'bg-primary text-primary-foreground'
                    )}
                    onClick={() => setSelectedTime(time)}
                  >
                    <Clock className='mr-2 h-4 w-4' />
                    {time}
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
        </CardContent>
        <CardFooter>
          <Button
            type='submit'
            className='w-full'
            disabled={!selectedService || !date || !selectedTime || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Agendando...
              </>
            ) : (
              'Agendar Consulta'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

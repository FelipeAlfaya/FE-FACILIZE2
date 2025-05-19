'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, isSameDay } from 'date-fns'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, Trash2, Save, CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { TimeInput } from '../../components/time-input'
import { toast } from '@/components/ui/use-toast'

const weekDays = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Segunda' },
  { value: '2', label: 'Terça' },
  { value: '3', label: 'Quarta' },
  { value: '4', label: 'Quinta' },
  { value: '5', label: 'Sexta' },
  { value: '6', label: 'Sábado' },
]

interface TimeSlot {
  id: string
  start: string
  end: string
}

interface DayAvailability {
  enabled: boolean
  timeSlots: TimeSlot[]
}

interface WeeklyAvailability {
  [key: string]: DayAvailability
}

interface SpecificDateAvailability {
  [key: string]: TimeSlot[]
}

interface AvailabilityManagerProps {
  providerId: string
  onSave?: () => void
}

export function AvailabilityManager({
  providerId,
  onSave,
}: AvailabilityManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('weekly')
  const [weeklyAvailability, setWeeklyAvailability] =
    useState<WeeklyAvailability>(() => {
      return weekDays.reduce((acc, day) => {
        acc[day.value] = { enabled: false, timeSlots: [] }
        return acc
      }, {} as WeeklyAvailability)
    })
  const [specificDates, setSpecificDates] = useState<SpecificDateAvailability>(
    {}
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const getDateKey = useCallback((date: Date | undefined): string => {
    return date ? format(date, 'yyyy-MM-dd') : ''
  }, [])

  useEffect(() => {
    let mounted = true

    const fetchAvailability = async () => {
      if (!providerId) return

      try {
        setIsLoading(true)
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        console.log('Fetching availability for provider:', providerId)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}appointments/provider/${providerId}/availability`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Erro ao carregar disponibilidade')
        }

        const data = await response.json()
        console.log('Availability data:', data)

        if (!mounted) return

        // Initialize weekly availability
        const transformedWeekly = weekDays.reduce((acc, day) => {
          acc[day.value] = {
            enabled: false,
            timeSlots: [],
          }
          return acc
        }, {} as WeeklyAvailability)

        // If we have available slots, populate them
        if (Array.isArray(data)) {
          data.forEach((slot: string) => {
            // Assuming the slot comes in HH:mm format
            const [hours] = slot.split(':')
            const weekday = new Date().getDay().toString()

            if (transformedWeekly[weekday]) {
              transformedWeekly[weekday].enabled = true
              transformedWeekly[weekday].timeSlots.push({
                id: `${weekday}-${slot}`,
                start: slot,
                end: `${(parseInt(hours) + 1).toString().padStart(2, '0')}:00`, // Adding 1 hour as default duration
              })
            }
          })
        }

        setWeeklyAvailability(transformedWeekly)
        console.log('Transformed weekly availability:', transformedWeekly)
      } catch (error) {
        console.error('Error fetching availability:', error)
        toast({
          title: 'Erro',
          description: 'Falha ao carregar disponibilidade',
          variant: 'destructive',
        })
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAvailability()

    return () => {
      mounted = false
    }
  }, [providerId])

  const handleDayToggle = useCallback((day: string, enabled: boolean) => {
    setWeeklyAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled,
        timeSlots: enabled ? prev[day]?.timeSlots || [] : [],
      },
    }))
  }, [])

  const addTimeSlot = useCallback((day: string) => {
    const newId = `${day}-${Date.now()}`
    setWeeklyAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [
          ...prev[day].timeSlots,
          { id: newId, start: '09:00', end: '17:00' },
        ],
      },
    }))
  }, [])

  const updateTimeSlot = useCallback(
    (day: string, id: string, field: 'start' | 'end', value: string) => {
      setWeeklyAvailability((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: prev[day].timeSlots.map((slot) =>
            slot.id === id ? { ...slot, [field]: value } : slot
          ),
        },
      }))
    },
    []
  )

  const removeTimeSlot = useCallback((day: string, id: string) => {
    setWeeklyAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((slot) => slot.id !== id),
      },
    }))
  }, [])

  const addSpecificDateSlot = useCallback(() => {
    if (!selectedDate) return
    const dateStr = getDateKey(selectedDate)

    setSpecificDates((prev) => ({
      ...prev,
      [dateStr]: [
        ...(prev[dateStr] || []),
        {
          id: `${dateStr}-${Date.now()}`,
          start: '09:00',
          end: '17:00',
        },
      ],
    }))
  }, [selectedDate, getDateKey])

  const updateSpecificDateSlot = useCallback(
    (date: Date, id: string, field: 'start' | 'end', value: string) => {
      const dateStr = getDateKey(date)
      setSpecificDates((prev) => ({
        ...prev,
        [dateStr]:
          prev[dateStr]?.map((slot) =>
            slot.id === id ? { ...slot, [field]: value } : slot
          ) || [],
      }))
    },
    [getDateKey]
  )

  const removeSpecificDateSlot = useCallback(
    (date: Date, id: string) => {
      const dateStr = getDateKey(date)
      setSpecificDates((prev) => ({
        ...prev,
        [dateStr]: prev[dateStr]?.filter((slot) => slot.id !== id) || [],
      }))
    },
    [getDateKey]
  )

  const handleSave = useCallback(async () => {
    setIsLoading(true)

    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      const availabilities: any[] = []

      Object.entries(weeklyAvailability).forEach(([weekday, dayData]) => {
        if (dayData.enabled) {
          dayData.timeSlots.forEach((slot) => {
            availabilities.push({
              weekday: parseInt(weekday),
              startTime: slot.start,
              endTime: slot.end,
            })
          })
        }
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/availability`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            providerId: parseInt(providerId),
            availabilities,
            specificDates,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar disponibilidade')
      }

      if (onSave) onSave()
      toast({
        title: 'Sucesso',
        description: 'Disponibilidade atualizada com sucesso!',
      })
    } catch (error: any) {
      console.error('Error saving availability:', error)
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao salvar disponibilidade',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [weeklyAvailability, specificDates, providerId, onSave])

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Gerenciar Disponibilidade</CardTitle>
        <CardDescription>
          Configure seus horários de atendimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='mb-4'>
            <TabsTrigger value='weekly'>Semanal</TabsTrigger>
            <TabsTrigger value='specific'>Datas Específicas</TabsTrigger>
          </TabsList>

          <TabsContent value='weekly' className='space-y-4'>
            {weekDays.map((day) => (
              <div key={day.value} className='border rounded-lg p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      checked={!!weeklyAvailability[day.value]?.enabled}
                      onCheckedChange={(checked) =>
                        handleDayToggle(day.value, checked)
                      }
                    />
                    <Label>{day.label}</Label>
                  </div>
                  {weeklyAvailability[day.value]?.enabled && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => addTimeSlot(day.value)}
                    >
                      <Plus className='h-4 w-4 mr-1' /> Adicionar Horário
                    </Button>
                  )}
                </div>

                {weeklyAvailability[day.value]?.enabled && (
                  <div className='space-y-2'>
                    {weeklyAvailability[day.value]?.timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className='flex items-center space-x-2'
                      >
                        <TimeInput
                          value={slot.start}
                          onChange={(value) =>
                            updateTimeSlot(day.value, slot.id, 'start', value)
                          }
                        />
                        <span>até</span>
                        <TimeInput
                          value={slot.end}
                          onChange={(value) =>
                            updateTimeSlot(day.value, slot.id, 'end', value)
                          }
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeTimeSlot(day.value, slot.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}

                    {weeklyAvailability[day.value]?.timeSlots.length === 0 && (
                      <p className='text-sm text-muted-foreground'>
                        Nenhum horário configurado para este dia.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value='specific' className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='w-full md:w-1/2'>
                <Label className='mb-2 block'>Selecione uma data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {selectedDate
                        ? format(selectedDate, 'PPP', { locale: ptBR })
                        : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (
                          date &&
                          selectedDate &&
                          isSameDay(date, selectedDate)
                        )
                          return
                        setSelectedDate(date)
                      }}
                      locale={ptBR}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className='w-full md:w-1/2'>
                {selectedDate && (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label>
                        Horários para {format(selectedDate, 'dd/MM/yyyy')}
                      </Label>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={addSpecificDateSlot}
                      >
                        <Plus className='h-4 w-4 mr-1' /> Adicionar Horário
                      </Button>
                    </div>

                    <div className='space-y-2'>
                      {specificDates[getDateKey(selectedDate)]?.map((slot) => (
                        <div
                          key={slot.id}
                          className='flex items-center space-x-2'
                        >
                          <TimeInput
                            value={slot.start}
                            onChange={(value) =>
                              updateSpecificDateSlot(
                                selectedDate,
                                slot.id,
                                'start',
                                value
                              )
                            }
                          />
                          <span>até</span>
                          <TimeInput
                            value={slot.end}
                            onChange={(value) =>
                              updateSpecificDateSlot(
                                selectedDate,
                                slot.id,
                                'end',
                                value
                              )
                            }
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() =>
                              removeSpecificDateSlot(selectedDate, slot.id)
                            }
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}

                      {(!specificDates[getDateKey(selectedDate)] ||
                        specificDates[getDateKey(selectedDate)]?.length ===
                          0) && (
                        <p className='text-sm text-muted-foreground'>
                          Nenhum horário configurado para esta data.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!selectedDate && (
                  <div className='h-full flex items-center justify-center'>
                    <p className='text-muted-foreground'>
                      Selecione uma data para configurar horários específicos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading} className='ml-auto'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Salvando...
            </>
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Salvar Disponibilidade
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}


'use client'

import { useState, useEffect } from 'react'
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
import { TimeInput } from './time-input'

// Days of the week
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
  [key: string]: DayAvailability // key is day of week (0-6)
}

interface SpecificDateAvailability {
  [key: string]: TimeSlot[] // key is date in format YYYY-MM-DD
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
    useState<WeeklyAvailability>({
      '0': { enabled: false, timeSlots: [] },
      '1': {
        enabled: true,
        timeSlots: [{ id: '1-1', start: '09:00', end: '17:00' }],
      },
      '2': {
        enabled: true,
        timeSlots: [{ id: '2-1', start: '09:00', end: '17:00' }],
      },
      '3': {
        enabled: true,
        timeSlots: [{ id: '3-1', start: '09:00', end: '17:00' }],
      },
      '4': {
        enabled: true,
        timeSlots: [{ id: '4-1', start: '09:00', end: '17:00' }],
      },
      '5': {
        enabled: true,
        timeSlots: [{ id: '5-1', start: '09:00', end: '17:00' }],
      },
      '6': { enabled: false, timeSlots: [] },
    })
  const [specificDates, setSpecificDates] = useState<SpecificDateAvailability>(
    {}
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('')

  // Fetch provider availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // In a real app, you would fetch data from your API
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${providerId}/availability`)
        // const data = await response.json()
        // setWeeklyAvailability(data.weekly)
        // setSpecificDates(data.specificDates)
        // Using mock data for now
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
    }

    fetchAvailability()
  }, [providerId])

  // Update selected date string when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedDateStr(format(selectedDate, 'yyyy-MM-dd'))
    } else {
      setSelectedDateStr('')
    }
  }, [selectedDate])

  const handleDayToggle = (day: string, enabled: boolean) => {
    setWeeklyAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled,
      },
    }))
  }

  const addTimeSlot = (day: string) => {
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
  }

  const updateTimeSlot = (
    day: string,
    id: string,
    field: 'start' | 'end',
    value: string
  ) => {
    setWeeklyAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot) =>
          slot.id === id ? { ...slot, [field]: value } : slot
        ),
      },
    }))
  }

  const removeTimeSlot = (day: string, id: string) => {
    setWeeklyAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((slot) => slot.id !== id),
      },
    }))
  }

  const addSpecificDateSlot = () => {
    if (!selectedDateStr) return

    setSpecificDates((prev) => ({
      ...prev,
      [selectedDateStr]: [
        ...(prev[selectedDateStr] || []),
        {
          id: `${selectedDateStr}-${Date.now()}`,
          start: '09:00',
          end: '17:00',
        },
      ],
    }))
  }

  const updateSpecificDateSlot = (
    date: string,
    id: string,
    field: 'start' | 'end',
    value: string
  ) => {
    setSpecificDates((prev) => ({
      ...prev,
      [date]: prev[date].map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      ),
    }))
  }

  const removeSpecificDateSlot = (date: string, id: string) => {
    setSpecificDates((prev) => ({
      ...prev,
      [date]: prev[date].filter((slot) => slot.id !== id),
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would send this data to your API
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${providerId}/availability`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     weekly: weeklyAvailability,
      //     specificDates
      //   })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onSave) onSave()
    } catch (error) {
      console.error('Error saving availability:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
                      checked={weeklyAvailability[day.value]?.enabled}
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
                      onSelect={setSelectedDate}
                      locale={ptBR}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className='w-full md:w-1/2'>
                {selectedDateStr && (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label>
                        Horários para{' '}
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
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
                      {specificDates[selectedDateStr]?.map((slot) => (
                        <div
                          key={slot.id}
                          className='flex items-center space-x-2'
                        >
                          <TimeInput
                            value={slot.start}
                            onChange={(value) =>
                              updateSpecificDateSlot(
                                selectedDateStr,
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
                                selectedDateStr,
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
                              removeSpecificDateSlot(selectedDateStr, slot.id)
                            }
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}

                      {(!specificDates[selectedDateStr] ||
                        specificDates[selectedDateStr]?.length === 0) && (
                        <p className='text-sm text-muted-foreground'>
                          Nenhum horário configurado para esta data.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!selectedDateStr && (
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

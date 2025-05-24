'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  CheckCircle,
  XCircle,
  Plus,
  Trash,
  AlertTriangle,
  X,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

// TimeSlot representa um único intervalo de horário
type TimeSlot = {
  id?: number
  startTime: string
  endTime: string
}

// Availability representa um dia com múltiplos intervalos
type Availability = {
  id?: number
  weekday: number
  timeSlots: TimeSlot[]
}

// Tipo para compatibilidade com a API
type ApiAvailability = {
  id?: number
  weekday: number
  startTime: string
  endTime: string
}

const weekdays = [
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
]

export function AvailabilityManager({ providerId }: { providerId: string }) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [intervalToDelete, setIntervalToDelete] = useState<{
    weekday: number
    index: number
  } | null>(null)
  const [dayToDeleteAll, setDayToDeleteAll] = useState<number | null>(null)
  const [showDeleteDayConfirm, setShowDeleteDayConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newSlot, setNewSlot] = useState<{
    weekday: number
    startTime: string
    endTime: string
  }>({
    weekday: 1,
    startTime: '',
    endTime: '',
  })

  // Inicializa a estrutura de disponibilidade com dias vazios
  useEffect(() => {
    const initializeAvailabilities = () => {
      return weekdays.map((day) => ({
        weekday: day.id,
        timeSlots: [],
      }))
    }

    setAvailabilities(initializeAvailabilities())
  }, [])

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        console.log(
          'Buscando disponibilidades com token:',
          token?.substring(0, 10) + '...'
        )

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}appointments/my-availability`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Erro na resposta da API:', response.status, errorText)
          const errorData = await response.json().catch(() => ({
            message: errorText || 'Erro desconhecido',
          }))
          throw new Error(
            errorData?.message || 'Erro ao buscar disponibilidades',
            { cause: errorData }
          )
        }

        // Dados recebidos da API no formato antigo
        const apiData: ApiAvailability[] = await response.json()
        console.log('Dados recebidos da API:', apiData)

        // Converte dados da API para o novo formato com múltiplos slots
        const newAvailabilities = weekdays.map((day) => {
          // Filtra todos os slots para este dia
          const daySlots = apiData.filter((slot) => slot.weekday === day.id)

          // Converte para o novo formato
          return {
            weekday: day.id,
            timeSlots: daySlots.map((slot) => ({
              id: slot.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
            })),
          }
        })

        setAvailabilities(newAvailabilities)
        console.log('Dados formatados:', newAvailabilities)
      } catch (error) {
        console.error('Error fetching availabilities:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as disponibilidades',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAvailabilities()
  }, [providerId])

  const handleAddNewSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast({
        title: 'Atenção',
        description: 'Preencha ambos os horários',
        variant: 'destructive',
      })
      return
    }

    if (
      !validateTimeFormat(newSlot.startTime) ||
      !validateTimeFormat(newSlot.endTime)
    ) {
      toast({
        title: 'Formato inválido',
        description: 'Use o formato HH:MM (24 horas)',
        variant: 'destructive',
      })
      return
    }

    // Verifica se o horário de início é anterior ao de término
    if (newSlot.startTime >= newSlot.endTime) {
      toast({
        title: 'Horário inválido',
        description: 'O horário de início deve ser anterior ao de término',
        variant: 'destructive',
      })
      return
    }

    // Verifica conflito com outros slots do mesmo dia
    const dayIndex = availabilities.findIndex(
      (day) => day.weekday === newSlot.weekday
    )

    const hasConflict = availabilities[dayIndex].timeSlots.some((slot) => {
      return (
        (newSlot.startTime >= slot.startTime &&
          newSlot.startTime < slot.endTime) ||
        (newSlot.endTime > slot.startTime && newSlot.endTime <= slot.endTime) ||
        (newSlot.startTime <= slot.startTime && newSlot.endTime >= slot.endTime)
      )
    })

    if (hasConflict) {
      toast({
        title: 'Conflito de horário',
        description: 'Este intervalo se sobrepõe a um horário já existente',
        variant: 'destructive',
      })
      return
    }

    // Adiciona o novo slot ao dia correspondente
    const newAvailabilities = [...availabilities]
    newAvailabilities[dayIndex].timeSlots.push({
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
    })

    // Ordena os slots por horário de início
    newAvailabilities[dayIndex].timeSlots.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    )

    setAvailabilities(newAvailabilities)
    setHasChanges(true)
    setIsAddingNew(false)

    toast({
      title: 'Horário adicionado',
      description: `Horário ${newSlot.startTime} até ${newSlot.endTime} adicionado com sucesso`,
    })

    setNewSlot({ weekday: newSlot.weekday, startTime: '', endTime: '' })
  }

  const handleRemoveSlot = (weekday: number, index: number) => {
    setIntervalToDelete({ weekday, index })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteSlot = async () => {
    if (!intervalToDelete) return

    setIsDeleting(true)
    const { weekday, index } = intervalToDelete

    const dayIndex = availabilities.findIndex((day) => day.weekday === weekday)
    if (dayIndex >= 0) {
      // Salva o horário para referência
      const slot = availabilities[dayIndex].timeSlots[index]
      const dayName = weekdays.find((d) => d.id === weekday)?.name

      try {
        // Se o slot tem ID, deleta pela API
        if (slot.id) {
          console.log(`Removendo slot com ID: ${slot.id}`)
          const token =
            localStorage.getItem('access_token') ||
            sessionStorage.getItem('access_token')

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}appointments/availability/${slot.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error(
              'Erro ao deletar disponibilidade:',
              response.status,
              errorText
            )
            throw new Error('Erro ao remover disponibilidade')
          }

          const result = await response.json()
          console.log('Resultado da deleção:', result)
        }

        // Atualiza o estado local
        const newAvailabilities = [...availabilities]
        newAvailabilities[dayIndex].timeSlots.splice(index, 1)
        setAvailabilities(newAvailabilities)
        setHasChanges(true)

        toast({
          title: 'Horário removido',
          description: `Intervalo ${slot.startTime} - ${slot.endTime} de ${dayName} removido`,
        })
      } catch (error) {
        console.error('Erro ao remover horário:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível remover o horário',
          variant: 'destructive',
        })
      }
    }

    setShowDeleteConfirm(false)
    setIntervalToDelete(null)
    setIsDeleting(false)
  }

  const handleClearAll = async () => {
    setIsDeleting(true)

    try {
      // Coleta todos os slots com IDs que precisam ser excluídos na API
      const allSlotsWithIds = availabilities.flatMap((day) =>
        day.timeSlots
          .filter((slot) => slot.id)
          .map((slot) => ({ dayId: day.weekday, id: slot.id }))
      )

      // Para cada slot com ID, chamar API para remover
      const deletePromises = allSlotsWithIds.map(async ({ id }) => {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}appointments/availability/${id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        } catch (error) {
          console.error(`Erro ao deletar slot ${id}:`, error)
        }
      })

      // Executa todos os deletes em paralelo
      await Promise.all(deletePromises)

      // Reinicializa todos os dias sem horários
      const emptyAvailabilities = weekdays.map((day) => ({
        weekday: day.id,
        timeSlots: [],
      }))

      setAvailabilities(emptyAvailabilities)
      setHasChanges(true)

      toast({
        title: 'Horários limpos',
        description: 'Todos os horários foram removidos',
      })
    } catch (error) {
      console.error('Erro ao limpar todos os horários:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um problema ao limpar os horários',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)

      // Fechar o diálogo
      const closeButton = document.querySelector(
        '[data-state="open"] button[aria-label="Close"]'
      )
      if (closeButton instanceof HTMLElement) {
        closeButton.click()
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')

      // Converte múltiplos slots para o formato esperado pela API
      const apiAvailabilities: ApiAvailability[] = []

      availabilities.forEach((day) => {
        day.timeSlots.forEach((slot) => {
          apiAvailabilities.push({
            weekday: day.weekday,
            startTime: slot.startTime,
            endTime: slot.endTime,
            id: slot.id,
          })
        })
      })

      console.log('Enviando disponibilidades para salvar:', apiAvailabilities)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}appointments/availability`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availabilities: apiAvailabilities,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao salvar:', response.status, errorText)
        throw new Error('Erro ao salvar disponibilidades')
      }

      // Atualiza com os dados retornados da API (incluindo novos IDs)
      const result = await response.json()
      console.log('Resposta do servidor:', result)

      // Se a API retornar os dados atualizados, usamos eles para atualizar o estado
      if (Array.isArray(result)) {
        const newAvailabilities = [...availabilities]

        // Atualiza os IDs dos slots recém-criados
        result.forEach((apiSlot) => {
          const dayIndex = newAvailabilities.findIndex(
            (day) => day.weekday === apiSlot.weekday
          )
          if (dayIndex >= 0) {
            // Encontra o slot correspondente pelo horário
            const slotIndex = newAvailabilities[dayIndex].timeSlots.findIndex(
              (slot) =>
                slot.startTime === apiSlot.startTime &&
                slot.endTime === apiSlot.endTime
            )
            if (slotIndex >= 0) {
              newAvailabilities[dayIndex].timeSlots[slotIndex].id = apiSlot.id
            }
          }
        })

        setAvailabilities(newAvailabilities)
      }

      toast({
        title: 'Sucesso',
        description: 'Disponibilidades atualizadas com sucesso',
      })
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving availabilities:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as disponibilidades',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const validateTimeFormat = (time: string) => {
    if (!time) return false
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
  }

  const getDayStatus = (day: Availability) => {
    if (day.timeSlots.length === 0) {
      return 'inactive'
    }

    const hasInvalid = day.timeSlots.some(
      (slot) =>
        !validateTimeFormat(slot.startTime) || !validateTimeFormat(slot.endTime)
    )

    if (hasInvalid) {
      return 'error'
    }

    return 'active'
  }

  const getTotalIntervals = () => {
    return availabilities.reduce(
      (total, day) => total + day.timeSlots.length,
      0
    )
  }

  const confirmDeleteAllDaySlots = () => {
    if (dayToDeleteAll === null) return

    const dayIndex = availabilities.findIndex(
      (d) => d.weekday === dayToDeleteAll
    )
    const dayName = weekdays.find((d) => d.id === dayToDeleteAll)?.name

    if (dayIndex >= 0) {
      // Cria um backup dos slots que serão deletados
      const slotsToDelete = [...availabilities[dayIndex].timeSlots]

      // Atualiza localmente
      const newAvailabilities = [...availabilities]
      newAvailabilities[dayIndex].timeSlots = []
      setAvailabilities(newAvailabilities)
      setHasChanges(true)

      // Para cada slot com ID, chamar API para remover
      const deletePromises = slotsToDelete
        .filter((slot) => slot.id)
        .map(async (slot) => {
          try {
            const token =
              localStorage.getItem('access_token') ||
              sessionStorage.getItem('access_token')
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}appointments/availability/${slot.id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          } catch (error) {
            console.error(`Erro ao deletar slot ${slot.id}:`, error)
          }
        })

      // Executa todos os deletes em paralelo
      Promise.all(deletePromises)
        .then(() => {
          console.log(`Todos os slots do dia ${dayName} foram removidos`)
        })
        .catch((error) => {
          console.error('Erro ao remover todos os slots:', error)
        })

      toast({
        title: 'Horários removidos',
        description: `Todos os horários de ${dayName} foram removidos`,
      })
    }

    setShowDeleteDayConfirm(false)
    setDayToDeleteAll(null)
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        {weekdays.map((day) => (
          <div key={day.id} className='flex items-center gap-4 animate-pulse'>
            <div className='h-10 w-32 rounded'></div>
            <div className='h-10 w-24 rounded'></div>
            <div className='h-10 w-24 rounded'></div>
            <div className='h-10 w-24 rounded'></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-lg font-medium'>Horários de Atendimento</h2>
          <p className='text-sm text-gray-500'>
            {getTotalIntervals()}{' '}
            {getTotalIntervals() === 1 ? 'intervalo' : 'intervalos'}{' '}
            configurados
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(!isAddingNew)}
          variant='outline'
          className='gap-2'
        >
          <Plus className='h-4 w-4' />
          {isAddingNew ? 'Cancelar' : 'Adicionar Horário'}
        </Button>
      </div>

      {/* Formulário para adicionar novo horário */}
      <Collapsible open={isAddingNew}>
        <CollapsibleContent className='CollapsibleContent'>
          <div className='p-4 border rounded-lg mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Dia da Semana
                </label>
                <Select
                  value={newSlot.weekday.toString()}
                  onValueChange={(value) =>
                    setNewSlot({ ...newSlot, weekday: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione' />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map((day) => (
                      <SelectItem key={day.id} value={day.id.toString()}>
                        {day.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Início</label>
                <Input
                  type='time'
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Término
                </label>
                <Input
                  type='time'
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  className='w-full'
                />
              </div>

              <div className='flex items-end'>
                <Button
                  onClick={handleAddNewSlot}
                  className='w-full'
                  disabled={!newSlot.startTime || !newSlot.endTime}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Exibição dos horários por dia */}
      <div className='space-y-4'>
        {availabilities.map((day) => {
          const status = getDayStatus(day)
          const dayName = weekdays.find((d) => d.id === day.weekday)?.name

          return (
            <Card
              key={day.weekday}
              className={`border ${
                status === 'error' ? 'border-red-500' : ''
              } ${
                day.timeSlots.length > 0 ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-center'>
                  <CardTitle className='text-base'>{dayName}</CardTitle>
                  <div className='flex items-center gap-2'>
                    {day.timeSlots.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-500 hover:text-red-700 h-7 px-2'
                              onClick={() => {
                                setDayToDeleteAll(day.weekday)
                                setShowDeleteDayConfirm(true)
                              }}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Limpar todos os horários deste dia</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {status === 'active' && (
                      <Badge variant='secondary' className='ml-2'>
                        <div className='flex items-center text-primary gap-1'>
                          <CheckCircle className='h-3 w-3' />
                          <span>
                            {day.timeSlots.length}{' '}
                            {day.timeSlots.length === 1
                              ? 'horário'
                              : 'horários'}
                          </span>
                        </div>
                      </Badge>
                    )}
                    {status === 'inactive' && (
                      <Badge variant='outline' className='ml-2'>
                        <div className='flex items-center text-gray-400 gap-1'>
                          <XCircle className='h-3 w-3' />
                          <span>Sem horários</span>
                        </div>
                      </Badge>
                    )}
                  </div>
                </div>
                <Separator className='my-2' />
              </CardHeader>
              <CardContent>
                {day.timeSlots.length === 0 ? (
                  <div className='text-center py-3 text-sm text-gray-500'>
                    Nenhum horário definido para {dayName}
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {day.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-muted/40 p-2 rounded-lg border border-muted transition-all hover:border-muted-foreground/20'
                        data-slot-id={`day-${day.weekday}-slot-${index}`}
                      >
                        <div className='flex items-center space-x-4'>
                          <div className='w-24'>
                            <Input
                              type='time'
                              value={slot.startTime}
                              onChange={(e) => {
                                const newAvailabilities = [...availabilities]
                                const dayIndex = newAvailabilities.findIndex(
                                  (d) => d.weekday === day.weekday
                                )
                                newAvailabilities[dayIndex].timeSlots[
                                  index
                                ].startTime = e.target.value
                                setAvailabilities(newAvailabilities)
                                setHasChanges(true)
                              }}
                              className={`${
                                !validateTimeFormat(slot.startTime)
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                          </div>
                          <span>até</span>
                          <div className='w-24'>
                            <Input
                              type='time'
                              value={slot.endTime}
                              onChange={(e) => {
                                const newAvailabilities = [...availabilities]
                                const dayIndex = newAvailabilities.findIndex(
                                  (d) => d.weekday === day.weekday
                                )
                                newAvailabilities[dayIndex].timeSlots[
                                  index
                                ].endTime = e.target.value
                                setAvailabilities(newAvailabilities)
                                setHasChanges(true)
                              }}
                              className={`${
                                !validateTimeFormat(slot.endTime)
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() =>
                                  handleRemoveSlot(day.weekday, index)
                                }
                                className='text-red-500 hover:text-red-700 hover:bg-red-100'
                              >
                                <Trash className='h-4 w-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remover intervalo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className='pt-0'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setIsAddingNew(true)
                    setNewSlot({
                      weekday: day.weekday,
                      startTime: '',
                      endTime: '',
                    })
                    // Faz scroll para o formulário
                    setTimeout(() => {
                      const form = document.querySelector('.CollapsibleContent')
                      form?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                    }, 100)
                  }}
                  className='text-primary'
                >
                  <Plus className='h-4 w-4 mr-1' /> Novo horário para {dayName}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className='flex justify-end gap-2'>
        {/* Dialog de confirmação para excluir um intervalo */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Remover intervalo</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover este intervalo de horário?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type='button'
                variant='destructive'
                onClick={confirmDeleteSlot}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removendo...' : 'Remover'}
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para limpar um dia específico */}
        <Dialog
          open={showDeleteDayConfirm}
          onOpenChange={setShowDeleteDayConfirm}
        >
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Limpar dia</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover todos os horários de{' '}
                {weekdays.find((d) => d.id === dayToDeleteAll)?.name}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type='button'
                variant='destructive'
                onClick={confirmDeleteAllDaySlots}
              >
                Remover todos os horários
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={() => setShowDeleteDayConfirm(false)}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para limpar todos os dias */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='border-red-200 hover:bg-red-50 hover:text-red-600 gap-2'
            >
              <AlertTriangle className='h-4 w-4' /> Limpar Tudo
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Tem certeza?</DialogTitle>
              <DialogDescription>
                Esta ação irá remover todos os horários de disponibilidade
                configurados. Esta operação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='sm:justify-start'>
              <Button
                type='button'
                variant='destructive'
                onClick={handleClearAll}
              >
                Limpar todos os horários
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={(e) => {
                  const closeButton = document.querySelector(
                    '[data-state="open"] button[aria-label="Close"]'
                  )
                  if (closeButton instanceof HTMLElement) {
                    closeButton.click()
                  }
                }}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className='bg-primary hover:bg-primary/90'
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className='rounded-lg border p-4'>
        <h3 className='font-medium mb-2'>
          Como configurar sua disponibilidade
        </h3>
        <ul className='text-sm space-y-2 text-gray-600'>
          <li>
            • Use o botão "Adicionar Horário" para criar novos intervalos de
            atendimento
          </li>
          <li>
            • Selecione o dia da semana e defina os horários de início e término
          </li>
          <li>
            • Você pode adicionar múltiplos intervalos para cada dia (manhã,
            tarde, etc.)
          </li>
          <li>• Os intervalos não podem se sobrepor no mesmo dia</li>
          <li>• Clique no ícone de lixeira para remover um intervalo</li>
          <li>• Não esqueça de salvar suas alterações</li>
        </ul>
      </div>
    </div>
  )
}

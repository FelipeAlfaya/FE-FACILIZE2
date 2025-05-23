'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { startTransition, useTransition } from 'react'
import { ptBR } from 'date-fns/locale'
import { createPersonalAppointment } from '@/app/dashboard/schedule/actions'
import { getToken } from '@/lib/auth'

// Define the form schema based on the DTO
const appointmentFormSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().optional(),
  date: z.date({ required_error: 'Data é obrigatória' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário de início deve estar no formato HH:mm',
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário de término deve estar no formato HH:mm',
  }),
  location: z.string().optional(),
  isAllDay: z.boolean().default(false),
  color: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

interface AppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<AppointmentFormValues>
}

export function AppointmentModal({
  open,
  onOpenChange,
  defaultValues = {
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    isAllDay: false,
    color: '#4f46e5',
  },
}: AppointmentModalProps) {
  const router = useRouter()
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  })
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(data: AppointmentFormValues) {
    startTransition(async () => {
      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.')
        }

        const appointmentData = {
          ...data,
          startDate: format(
            new Date(`${format(data.date, 'yyyy-MM-dd')}T${data.startTime}:00`),
            "yyyy-MM-dd'T'HH:mm:ss"
          ),
          endDate: format(
            new Date(`${format(data.date, 'yyyy-MM-dd')}T${data.endTime}:00`),
            "yyyy-MM-dd'T'HH:mm:ss"
          ),
          isAllDay: data.isAllDay,
        }

        await createPersonalAppointment(appointmentData, token)

        toast({
          title: 'Sucesso',
          description: `Compromisso "${data.title}" criado para ${format(
            data.date,
            "dd 'de' MMMM 'de' yyyy",
            { locale: ptBR }
          )}`,
        })

        onOpenChange(false)
        form.reset()
        router.refresh()
      } catch (error) {
        let errorMessage = 'Ocorreu um erro ao criar o compromisso'

        if (error instanceof Error) {
          if (error.message.includes('Sessão expirada')) {
            errorMessage = error.message
          } else if (error.message.includes('Failed to create')) {
            errorMessage = 'Falha ao criar o compromisso no servidor'
          } else if (error.message.includes('validation')) {
            errorMessage = 'Dados inválidos. Verifique os campos do formulário.'
          }
        }

        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    })
  }

  // Predefined color options
  const colorOptions = [
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#ef4444', label: 'Red' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#6366f1', label: 'Purple' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crie um agendamento pessoal</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para criar um novo agendamento pessoal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder='Reunião com o time...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Adicione detalhes desse agendamento'
                      className='resize-none'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isAllDay'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Todos os dias</FormLabel>
                      <FormDescription>É um evento diário?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {!form.watch('isAllDay') && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de início</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input type='time' placeholder='09:00' {...field} />
                          <Clock className='absolute right-3 top-2.5 h-4 w-4 text-muted-foreground' />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='endTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Término</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input type='time' placeholder='10:00' {...field} />
                          <Clock className='absolute right-3 top-2.5 h-4 w-4 text-muted-foreground' />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Sala de reunião 304b'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className='flex flex-wrap gap-2'>
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className={cn(
                          'w-8 h-8 rounded-full cursor-pointer border-2',
                          field.value === color.value
                            ? 'border-black dark:border-white'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => form.setValue('color', color.value)}
                        title={color.label}
                      />
                    ))}
                    <FormControl>
                      <Input
                        type='color'
                        className='w-8 h-8 p-0 overflow-hidden rounded-full cursor-pointer'
                        {...field}
                        value={field.value || '#4f46e5'}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Criando...' : 'Criar Compromisso'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


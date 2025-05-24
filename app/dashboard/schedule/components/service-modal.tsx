'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Clock, DollarSign, Save, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Service {
  name: string
  description: string
  price: number
  duration: number
  providerId?: number
}

// Define o esquema do formulário baseado no DTO
const serviceFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome do serviço é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }),
  price: z.coerce
    .number()
    .min(0, { message: 'Preço deve ser um número positivo' }),
  duration: z.coerce
    .number()
    .int()
    .min(1, { message: 'Duração deve ser pelo menos 1 minuto' }),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>

interface ServiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Service) => void
  title: string
  description: string
  submitLabel: string
  defaultValues?: Service
}

export function ServiceModal({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  submitLabel,
  defaultValues = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    providerId: 1,
  },
}: ServiceModalProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description,
      price: defaultValues.price,
      duration: defaultValues.duration,
    },
  })

  function handleSubmit(data: ServiceFormValues) {
    // Adiciona o providerId do defaultValues
    const serviceData = {
      ...data,
      providerId: defaultValues.providerId,
    }

    onSubmit(serviceData)
    toast({
      title: 'Sucesso',
      description: `Serviço ${
        submitLabel === 'Adicionar Serviço' ? 'adicionado' : 'atualizado'
      } com sucesso.`,
    })
    if (submitLabel === 'Adicionar Serviço') {
      form.reset({
        name: '',
        description: '',
        price: 0,
        duration: 30,
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder='Consulta' {...field} />
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
                      placeholder='Descrição detalhada do serviço'
                      className='resize-none min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <DollarSign className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          type='number'
                          placeholder='0.00'
                          className='pl-9'
                          {...field}
                          onChange={(e) => {
                            const value =
                              e.target.value === '' ? '0' : e.target.value
                            field.onChange(Number.parseFloat(value))
                          }}
                          value={field.value}
                          step='0.01'
                          min='0'
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Preço em reais</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='duration'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Clock className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          type='number'
                          placeholder='30'
                          className='pl-9'
                          {...field}
                          onChange={(e) => {
                            const value =
                              e.target.value === '' ? '0' : e.target.value
                            field.onChange(Number.parseInt(value, 10))
                          }}
                          value={field.value}
                          min='1'
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Duração em minutos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit'>
                {submitLabel === 'Adicionar Serviço' ? (
                  <Plus className='mr-2 h-4 w-4' />
                ) : (
                  <Save className='mr-2 h-4 w-4' />
                )}
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

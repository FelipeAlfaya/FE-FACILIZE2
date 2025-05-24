'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Clock, DollarSign, Save, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define the form schema based on the DTO
const serviceFormSchema = z.object({
  name: z.string().min(1, { message: 'Service name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z.coerce
    .number()
    .min(0, { message: 'Price must be a positive number' }),
  duration: z.coerce
    .number()
    .int()
    .min(1, { message: 'Duration must be at least 1 minute' }),
  providerId: z.coerce
    .number()
    .int()
    .min(1, { message: 'Provider is required' }),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>

// Mock data for providers - replace with actual data in your implementation
const mockProviders = [
  { id: 1, name: 'Dr. Jane Smith' },
  { id: 2, name: 'Dr. John Doe' },
  { id: 3, name: 'Dr. Emily Johnson' },
]

interface ServiceManagementTabsProps {
  services?: ServiceFormValues[]
  onAddService?: (data: ServiceFormValues) => void
  onUpdateService?: (id: number, data: ServiceFormValues) => void
}

export function ServiceManagementTabs({
  services = [],
  onAddService,
  onUpdateService,
}: ServiceManagementTabsProps) {
  const [activeTab, setActiveTab] = useState('add')
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  )

  // Form for adding a new service
  const addForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      providerId: undefined,
    },
  })

  // Form for updating an existing service
  const updateForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      providerId: undefined,
    },
  })

  // Handle service selection for update
  const handleServiceSelect = (serviceId: number) => {
    const service = services.find((s, index) => index === serviceId)
    if (service) {
      setSelectedServiceId(serviceId)
      updateForm.reset(service)
    }
  }

  // Handle add service submission
  const handleAddSubmit = (data: ServiceFormValues) => {
    onAddService?.(data)
    toast({
      title: 'Service added',
      description: `${data.name} has been added successfully.`,
    })
    addForm.reset({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      providerId: undefined,
    })
  }

  // Handle update service submission
  const handleUpdateSubmit = (data: ServiceFormValues) => {
    if (selectedServiceId !== null) {
      onUpdateService?.(selectedServiceId, data)
      toast({
        title: 'Service updated',
        description: `${data.name} has been updated successfully.`,
      })
    } else {
      toast({
        title: 'Error',
        description: 'Please select a service to update.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Tabs
      defaultValue='add'
      value={activeTab}
      onValueChange={setActiveTab}
      className='w-full'
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='add'>Adicionar serviço</TabsTrigger>
        <TabsTrigger value='update'>Atualizar serviço</TabsTrigger>
      </TabsList>

      {/* Add Service Tab */}
      <TabsContent value='add'>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar um novo serviço prestado</CardTitle>
            <CardDescription>
              Crie um novo serviço prestado para seus clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleAddSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={addForm.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do serviço</FormLabel>
                      <FormControl>
                        <Input placeholder='Corte de cabelo' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
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
                    control={addForm.control}
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
                    control={addForm.control}
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

                <FormField
                  control={addForm.control}
                  name='providerId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Provider</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value, 10))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a provider' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProviders.map((provider) => (
                            <SelectItem
                              key={provider.id}
                              value={provider.id.toString()}
                            >
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full'>
                  <Plus className='mr-2 h-4 w-4' /> Adicionar serviço
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Update Service Tab */}
      <TabsContent value='update'>
        <Card>
          <CardHeader>
            <CardTitle>Atualizar serviço</CardTitle>
            <CardDescription>
              Modifique um serviço prestado existente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-6'>
              <FormLabel>Selecione um serviço para atualizar</FormLabel>
              <Select
                onValueChange={(value) =>
                  handleServiceSelect(Number.parseInt(value, 10))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um serviço' />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedServiceId !== null && (
              <Form {...updateForm}>
                <form
                  onSubmit={updateForm.handleSubmit(handleUpdateSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={updateForm.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Corte de cabelo' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateForm.control}
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
                      control={updateForm.control}
                      name='price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
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
                      control={updateForm.control}
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

                  <FormField
                    control={updateForm.control}
                    name='providerId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prestador de serviço</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number.parseInt(value, 10))
                          }
                          defaultValue={field.value?.toString()}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione um prestador' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockProviders.map((provider) => (
                              <SelectItem
                                key={provider.id}
                                value={provider.id.toString()}
                              >
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full'>
                    <Save className='mr-2 h-4 w-4' /> Atualizar serviço
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

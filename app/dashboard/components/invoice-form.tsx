'use client'

import type React from 'react'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarIcon,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'

const cnpjSchema = z.string().refine(
  (value) => {
    const cnpj = value.replace(/[^\d]/g, '')
    if (cnpj.length !== 14) return false

    let sum = 0
    let weight = 5
    for (let i = 0; i < 12; i++) {
      sum += Number.parseInt(cnpj.charAt(i)) * weight
      weight = weight === 2 ? 9 : weight - 1
    }
    let digit = 11 - (sum % 11)
    const firstVerifier = digit >= 10 ? 0 : digit

    sum = 0
    weight = 6
    for (let i = 0; i < 13; i++) {
      sum += Number.parseInt(cnpj.charAt(i)) * weight
      weight = weight === 2 ? 9 : weight - 1
    }
    digit = 11 - (sum % 11)
    const secondVerifier = digit >= 10 ? 0 : digit

    return (
      Number.parseInt(cnpj.charAt(12)) === firstVerifier &&
      Number.parseInt(cnpj.charAt(13)) === secondVerifier
    )
  },
  { message: 'CNPJ inválido' }
)

const cpfSchema = z.string().refine(
  (value) => {
    const cpf = value.replace(/[^\d]/g, '')
    if (cpf.length !== 11) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    const firstVerifier = digit >= 10 ? 0 : digit

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    const secondVerifier = digit >= 10 ? 0 : digit

    return (
      Number.parseInt(cpf.charAt(9)) === firstVerifier &&
      Number.parseInt(cpf.charAt(10)) === secondVerifier
    )
  },
  { message: 'CPF inválido' }
)

const invoiceFormSchema = z.object({
  senderName: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  senderCNPJ: cnpjSchema,
  senderIE: z.string().min(1, { message: 'Inscrição Estadual é obrigatória' }),
  senderAddress: z
    .string()
    .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  senderCity: z.string().min(2, { message: 'Cidade é obrigatória' }),
  senderState: z
    .string()
    .length(2, { message: 'Estado deve ter 2 caracteres' }),
  senderZip: z.string().min(8, { message: 'CEP inválido' }),

  recipientType: z.enum(['pf', 'pj']),
  recipientName: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  recipientDocument: z.string(),
  recipientIE: z.string().optional(),
  recipientAddress: z
    .string()
    .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  recipientCity: z.string().min(2, { message: 'Cidade é obrigatória' }),
  recipientState: z
    .string()
    .length(2, { message: 'Estado deve ter 2 caracteres' }),
  recipientZip: z.string().min(8, { message: 'CEP inválido' }),
  recipientEmail: z.string().email({ message: 'Email inválido' }),

  invoiceNumber: z.string().min(1, { message: 'Número da nota é obrigatório' }),
  invoiceSeries: z.string().min(1, { message: 'Série da nota é obrigatória' }),
  invoiceDate: z.date(),
  operationType: z
    .string()
    .min(1, { message: 'Tipo de operação é obrigatório' }),
  paymentMethod: z
    .string()
    .min(1, { message: 'Método de pagamento é obrigatório' }),
  cfop: z.string().min(1, { message: 'CFOP é obrigatório' }),
  natureOfOperation: z
    .string()
    .min(1, { message: 'Natureza da operação é obrigatória' }),

  additionalInfo: z.string().optional(),
})

const invoiceItemSchema = z.object({
  id: z.string(),
  description: z
    .string()
    .min(3, { message: 'Descrição deve ter pelo menos 3 caracteres' }),
  quantity: z
    .number()
    .min(0.01, { message: 'Quantidade deve ser maior que zero' }),
  unitValue: z
    .number()
    .min(0.01, { message: 'Valor unitário deve ser maior que zero' }),
  totalValue: z.number(),
  ncm: z.string().min(4, { message: 'NCM deve ter pelo menos 4 caracteres' }),
  cfop: z.string().min(4, { message: 'CFOP deve ter pelo menos 4 caracteres' }),
  icmsRate: z
    .number()
    .min(0, { message: 'Alíquota de ICMS deve ser maior ou igual a zero' }),
  ipiRate: z
    .number()
    .min(0, { message: 'Alíquota de IPI deve ser maior ou igual a zero' }),
  pisRate: z
    .number()
    .min(0, { message: 'Alíquota de PIS deve ser maior ou igual a zero' }),
  cofinsRate: z
    .number()
    .min(0, { message: 'Alíquota de COFINS deve ser maior ou igual a zero' }),
})

type InvoiceItem = z.infer<typeof invoiceItemSchema>

export function InvoiceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      senderName: 'Minha Empresa Ltda',
      senderCNPJ: '12.345.678/0001-90',
      senderIE: '123456789',
      senderAddress: 'Av. Paulista, 1000',
      senderCity: 'São Paulo',
      senderState: 'SP',
      senderZip: '01310-100',

      recipientType: 'pj',
      recipientName: '',
      recipientDocument: '',
      recipientIE: '',
      recipientAddress: '',
      recipientCity: '',
      recipientState: '',
      recipientZip: '',
      recipientEmail: '',

      invoiceNumber: '1',
      invoiceSeries: '1',
      invoiceDate: new Date(),
      operationType: '1',
      paymentMethod: '0',
      cfop: '5102',
      natureOfOperation: 'Venda de mercadoria',

      additionalInfo: '',
    },
  })

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: '',
      quantity: 1,
      unitValue: 0,
      totalValue: 0,
      ncm: '',
      cfop: '5102',
      icmsRate: 18,
      ipiRate: 0,
      pisRate: 0.65,
      cofinsRate: 3,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          if (field === 'quantity' || field === 'unitValue') {
            updatedItem.totalValue =
              updatedItem.quantity * updatedItem.unitValue
          }

          return updatedItem
        }
        return item
      })
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalValue, 0)
    const icmsTotal = items.reduce(
      (sum, item) => sum + (item.totalValue * item.icmsRate) / 100,
      0
    )
    const ipiTotal = items.reduce(
      (sum, item) => sum + (item.totalValue * item.ipiRate) / 100,
      0
    )
    const pisTotal = items.reduce(
      (sum, item) => sum + (item.totalValue * item.pisRate) / 100,
      0
    )
    const cofinsTotal = items.reduce(
      (sum, item) => sum + (item.totalValue * item.cofinsRate) / 100,
      0
    )

    const total = subtotal + ipiTotal

    return {
      subtotal,
      icmsTotal,
      ipiTotal,
      pisTotal,
      cofinsTotal,
      total,
    }
  }

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  const onSubmit = (data: z.infer<typeof invoiceFormSchema>) => {
    if (items.length === 0) {
      alert('Adicione pelo menos um item à nota fiscal')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      console.log('Form data:', data)
      console.log('Items:', items)
      setIsSubmitting(false)
      setIsComplete(true)
    }, 2000)
  }

  const handleRecipientDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target
    const type = form.getValues('recipientType')

    if (type === 'pj') {
      form.setValue('recipientDocument', formatCNPJ(value))
    } else {
      form.setValue('recipientDocument', formatCPF(value))
    }
  }

  const getRecipientDocumentSchema = () => {
    const type = form.getValues('recipientType')
    return type === 'pj' ? cnpjSchema : cpfSchema
  }

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = form.trigger([
        'senderName',
        'senderCNPJ',
        'senderIE',
        'senderAddress',
        'senderCity',
        'senderState',
        'senderZip',
      ])

      if (await isValid) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      const isValid = form.trigger([
        'recipientType',
        'recipientName',
        'recipientDocument',
        'recipientAddress',
        'recipientCity',
        'recipientState',
        'recipientZip',
        'recipientEmail',
      ])

      if (await isValid) {
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      const isValid = form.trigger([
        'invoiceNumber',
        'invoiceSeries',
        'invoiceDate',
        'operationType',
        'paymentMethod',
        'cfop',
        'natureOfOperation',
      ])

      if (await isValid) {
        setCurrentStep(4)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className='flex items-center justify-center mb-8'>
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className='flex items-center'>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep === step
                  ? 'border-primary bg-primary text-primary-foreground'
                  : currentStep > step
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-20 h-1 ${
                  currentStep > step
                    ? 'bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (isComplete) {
    return (
      <Card className='max-w-3xl mx-auto'>
        <CardContent className='pt-6'>
          <div className='text-center py-10'>
            <div className='w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle2 className='h-10 w-10 text-green-600 dark:text-green-500' />
            </div>
            <h2 className='text-2xl font-bold mb-2'>
              Nota Fiscal Emitida com Sucesso!
            </h2>
            <p className='text-muted-foreground mb-6'>
              A Nota Fiscal Eletrônica foi emitida e enviada para o
              destinatário.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                variant='outline'
                onClick={() => (window.location.href = '/dashboard/invoices')}
              >
                Ver Todas as Notas
              </Button>
              <Button
                onClick={() => {
                  setIsComplete(false)
                  setCurrentStep(1)
                  form.reset()
                  setItems([])
                }}
              >
                Emitir Nova Nota
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {renderStepIndicator()}

        <Card className='mb-8'>
          <CardContent className='pt-6'>
            {/* Step 1: Sender Information */}
            {currentStep === 1 && (
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-bold mb-4'>Dados do Emitente</h2>
                  <p className='text-muted-foreground mb-6'>
                    Informe os dados da empresa emitente da nota fiscal.
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='senderName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='senderCNPJ'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={formatCNPJ(field.value)}
                            onChange={(e) => {
                              field.onChange(formatCNPJ(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='senderIE'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className='my-4' />

                <div className='grid grid-cols-1 gap-6'>
                  <FormField
                    control={form.control}
                    name='senderAddress'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='senderCity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='senderState'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='AC'>AC</SelectItem>
                              <SelectItem value='AL'>AL</SelectItem>
                              <SelectItem value='AP'>AP</SelectItem>
                              <SelectItem value='AM'>AM</SelectItem>
                              <SelectItem value='BA'>BA</SelectItem>
                              <SelectItem value='CE'>CE</SelectItem>
                              <SelectItem value='DF'>DF</SelectItem>
                              <SelectItem value='ES'>ES</SelectItem>
                              <SelectItem value='GO'>GO</SelectItem>
                              <SelectItem value='MA'>MA</SelectItem>
                              <SelectItem value='MT'>MT</SelectItem>
                              <SelectItem value='MS'>MS</SelectItem>
                              <SelectItem value='MG'>MG</SelectItem>
                              <SelectItem value='PA'>PA</SelectItem>
                              <SelectItem value='PB'>PB</SelectItem>
                              <SelectItem value='PR'>PR</SelectItem>
                              <SelectItem value='PE'>PE</SelectItem>
                              <SelectItem value='PI'>PI</SelectItem>
                              <SelectItem value='RJ'>RJ</SelectItem>
                              <SelectItem value='RN'>RN</SelectItem>
                              <SelectItem value='RS'>RS</SelectItem>
                              <SelectItem value='RO'>RO</SelectItem>
                              <SelectItem value='RR'>RR</SelectItem>
                              <SelectItem value='SC'>SC</SelectItem>
                              <SelectItem value='SP'>SP</SelectItem>
                              <SelectItem value='SE'>SE</SelectItem>
                              <SelectItem value='TO'>TO</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='senderZip'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={formatCEP(field.value)}
                            onChange={(e) => {
                              field.onChange(formatCEP(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Recipient Information */}
            {currentStep === 2 && (
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-bold mb-4'>
                    Dados do Destinatário
                  </h2>
                  <p className='text-muted-foreground mb-6'>
                    Informe os dados do cliente ou empresa destinatária da nota
                    fiscal.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='recipientType'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Tipo de Pessoa</FormLabel>
                      <FormControl>
                        <div className='flex space-x-4'>
                          <div className='flex items-center space-x-2'>
                            <input
                              type='radio'
                              id='pj'
                              value='pj'
                              checked={field.value === 'pj'}
                              onChange={() => {
                                field.onChange('pj')
                                form.setValue('recipientDocument', '')
                                form.setValue('recipientIE', '')
                              }}
                              className='h-4 w-4 text-primary'
                            />
                            <label htmlFor='pj' className='text-sm font-medium'>
                              Pessoa Jurídica
                            </label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <input
                              type='radio'
                              id='pf'
                              value='pf'
                              checked={field.value === 'pf'}
                              onChange={() => {
                                field.onChange('pf')
                                form.setValue('recipientDocument', '')
                                form.setValue('recipientIE', '')
                              }}
                              className='h-4 w-4 text-primary'
                            />
                            <label htmlFor='pf' className='text-sm font-medium'>
                              Pessoa Física
                            </label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='recipientName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.getValues('recipientType') === 'pj'
                            ? 'Razão Social'
                            : 'Nome Completo'}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='recipientDocument'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.getValues('recipientType') === 'pj'
                            ? 'CNPJ'
                            : 'CPF'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={handleRecipientDocumentChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.getValues('recipientType') === 'pj' && (
                    <FormField
                      control={form.control}
                      name='recipientIE'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inscrição Estadual</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name='recipientEmail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className='my-4' />

                <div className='grid grid-cols-1 gap-6'>
                  <FormField
                    control={form.control}
                    name='recipientAddress'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='recipientCity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='recipientState'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='AC'>AC</SelectItem>
                              <SelectItem value='AL'>AL</SelectItem>
                              <SelectItem value='AP'>AP</SelectItem>
                              <SelectItem value='AM'>AM</SelectItem>
                              <SelectItem value='BA'>BA</SelectItem>
                              <SelectItem value='CE'>CE</SelectItem>
                              <SelectItem value='DF'>DF</SelectItem>
                              <SelectItem value='ES'>ES</SelectItem>
                              <SelectItem value='GO'>GO</SelectItem>
                              <SelectItem value='MA'>MA</SelectItem>
                              <SelectItem value='MT'>MT</SelectItem>
                              <SelectItem value='MS'>MS</SelectItem>
                              <SelectItem value='MG'>MG</SelectItem>
                              <SelectItem value='PA'>PA</SelectItem>
                              <SelectItem value='PB'>PB</SelectItem>
                              <SelectItem value='PR'>PR</SelectItem>
                              <SelectItem value='PE'>PE</SelectItem>
                              <SelectItem value='PI'>PI</SelectItem>
                              <SelectItem value='RJ'>RJ</SelectItem>
                              <SelectItem value='RN'>RN</SelectItem>
                              <SelectItem value='RS'>RS</SelectItem>
                              <SelectItem value='RO'>RO</SelectItem>
                              <SelectItem value='RR'>RR</SelectItem>
                              <SelectItem value='SC'>SC</SelectItem>
                              <SelectItem value='SP'>SP</SelectItem>
                              <SelectItem value='SE'>SE</SelectItem>
                              <SelectItem value='TO'>TO</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='recipientZip'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={formatCEP(field.value)}
                            onChange={(e) => {
                              field.onChange(formatCEP(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Invoice Details */}
            {currentStep === 3 && (
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-bold mb-4'>
                    Dados da Nota Fiscal
                  </h2>
                  <p className='text-muted-foreground mb-6'>
                    Informe os detalhes da nota fiscal a ser emitida.
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='invoiceNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Nota</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='invoiceSeries'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Série</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='invoiceDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Data de Emissão</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', {
                                    locale: ptBR,
                                  })
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
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='operationType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Operação</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='0'>0 - Entrada</SelectItem>
                              <SelectItem value='1'>1 - Saída</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='0'>0 - À Vista</SelectItem>
                              <SelectItem value='1'>1 - À Prazo</SelectItem>
                              <SelectItem value='2'>2 - Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='cfop'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CFOP</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='5102'>
                                5102 - Venda de mercadoria
                              </SelectItem>
                              <SelectItem value='5101'>
                                5101 - Venda de produção do estabelecimento
                              </SelectItem>
                              <SelectItem value='5201'>
                                5201 - Devolução de compra
                              </SelectItem>
                              <SelectItem value='5202'>
                                5202 - Devolução de compra para comercialização
                              </SelectItem>
                              <SelectItem value='5901'>
                                5901 - Remessa para conserto
                              </SelectItem>
                              <SelectItem value='5949'>
                                5949 - Outra saída de mercadoria
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='natureOfOperation'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Natureza da Operação</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='additionalInfo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informações Adicionais</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder='Informações complementares da nota fiscal'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Items */}
            {currentStep === 4 && (
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-bold mb-4'>
                    Itens da Nota Fiscal
                  </h2>
                  <p className='text-muted-foreground mb-6'>
                    Adicione os produtos ou serviços que compõem a nota fiscal.
                  </p>
                </div>

                <div className='space-y-4'>
                  {items.map((item, index) => (
                    <Card key={item.id} className='p-4'>
                      <div className='flex justify-between items-start mb-4'>
                        <h3 className='font-medium'>Item {index + 1}</h3>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                          <Label htmlFor={`item-${item.id}-description`}>
                            Descrição
                          </Label>
                          <Input
                            id={`item-${item.id}-description`}
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, 'description', e.target.value)
                            }
                            placeholder='Descrição do produto ou serviço'
                          />
                        </div>

                        <div>
                          <Label htmlFor={`item-${item.id}-ncm`}>NCM</Label>
                          <Input
                            id={`item-${item.id}-ncm`}
                            value={item.ncm}
                            onChange={(e) =>
                              updateItem(item.id, 'ncm', e.target.value)
                            }
                            placeholder='Código NCM'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <div>
                          <Label htmlFor={`item-${item.id}-quantity`}>
                            Quantidade
                          </Label>
                          <Input
                            id={`item-${item.id}-quantity`}
                            type='number'
                            min='0.01'
                            step='0.01'
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'quantity',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor={`item-${item.id}-unitValue`}>
                            Valor Unitário
                          </Label>
                          <Input
                            id={`item-${item.id}-unitValue`}
                            type='number'
                            min='0.01'
                            step='0.01'
                            value={item.unitValue}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'unitValue',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor={`item-${item.id}-totalValue`}>
                            Valor Total
                          </Label>
                          <Input
                            id={`item-${item.id}-totalValue`}
                            type='number'
                            value={item.totalValue.toFixed(2)}
                            disabled
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <div>
                          <Label htmlFor={`item-${item.id}-cfop`}>CFOP</Label>
                          <Input
                            id={`item-${item.id}-cfop`}
                            value={item.cfop}
                            onChange={(e) =>
                              updateItem(item.id, 'cfop', e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor={`item-${item.id}-icmsRate`}>
                            Alíquota ICMS (%)
                          </Label>
                          <Input
                            id={`item-${item.id}-icmsRate`}
                            type='number'
                            min='0'
                            step='0.01'
                            value={item.icmsRate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'icmsRate',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor={`item-${item.id}-ipiRate`}>
                            Alíquota IPI (%)
                          </Label>
                          <Input
                            id={`item-${item.id}-ipiRate`}
                            type='number'
                            min='0'
                            step='0.01'
                            value={item.ipiRate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'ipiRate',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor={`item-${item.id}-pisRate`}>
                            Alíquota PIS (%)
                          </Label>
                          <Input
                            id={`item-${item.id}-pisRate`}
                            type='number'
                            min='0'
                            step='0.01'
                            value={item.pisRate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                'pisRate',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button
                    type='button'
                    variant='outline'
                    onClick={addItem}
                    className='w-full'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Adicionar Item
                  </Button>
                </div>

                {items.length > 0 && (
                  <div className='mt-8'>
                    <h3 className='font-medium mb-4'>Resumo da Nota Fiscal</h3>
                    <div className='bg-muted/40 p-4 rounded-md'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Subtotal:
                          </p>
                          <p className='font-medium'>
                            R$ {calculateTotals().subtotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>ICMS:</p>
                          <p className='font-medium'>
                            R$ {calculateTotals().icmsTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>IPI:</p>
                          <p className='font-medium'>
                            R$ {calculateTotals().ipiTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>PIS:</p>
                          <p className='font-medium'>
                            R$ {calculateTotals().pisTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            COFINS:
                          </p>
                          <p className='font-medium'>
                            R$ {calculateTotals().cofinsTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm font-medium'>Total:</p>
                          <p className='text-lg font-bold'>
                            R$ {calculateTotals().total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex justify-between'>
          {currentStep > 1 ? (
            <Button type='button' variant='outline' onClick={prevStep}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Voltar
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <Button type='button' onClick={nextStep}>
              Próximo
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          ) : (
            <Button type='submit' disabled={isSubmitting || items.length === 0}>
              {isSubmitting ? 'Emitindo...' : 'Emitir Nota Fiscal'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

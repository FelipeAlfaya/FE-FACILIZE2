'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  ArrowRight,
  Trash2,
  Check,
  Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { PaymentMethodModal } from './payment-method-modal'

interface Plan {
  id: number
  name: string
  price: number
  description: string
  features: {
    id: number
    name: string
    planId: number
  }[]
}

interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export function BillingTab() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const [address, setAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'card_1',
      type: 'mastercard',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
    {
      id: 'card_2',
      type: 'visa',
      last4: '1234',
      expMonth: 8,
      expYear: 2024,
      isDefault: false,
    },
  ])

  const fetchPlan = async () => {
    if (!user) {
      setLoadingPlan(false)
      return
    }

    if (user.type === 'CLIENT') {
      setLoadingPlan(false)
      return
    }

    try {
      setLoadingPlan(true)
      setError(null)

      if (!user.provider?.planId) {
        throw new Error('No plan associated with this provider')
      }

      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}plans/${user.provider.planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch plan')
      }

      const data = await response.json()
      setPlan(data)
    } catch (err) {
      console.error('Error fetching plan:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch plan details'
      )
      toast.error('Failed to load plan information')
    } finally {
      setLoadingPlan(false)
    }
  }

  const setDefaultCard = (cardId: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === cardId,
      }))
    )
  }

  const removeCard = (cardId: string) => {
    setPaymentMethods((methods) =>
      methods.filter((method) => method.id !== cardId)
    )
  }

  const addCard = (newCard: any) => {
    setPaymentMethods((methods) => [
      ...methods.map((method) => ({
        ...method,
        isDefault: newCard.isDefault ? false : method.isDefault,
      })),
      newCard,
    ])
  }

  const fetchAddress = async () => {
    if (!user) return

    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user.id}/address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          // Address not found, which is okay
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch address')
      }

      const data = await response.json()
      setAddress(data)
      setFormData(data)
    } catch (err) {
      console.error('Error fetching address:', err)
      toast.error('Failed to load address information')
    }
  }

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setIsLoading(true)
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user.id}/address`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update address')
      }

      const data = await response.json()
      setAddress(data)
      setIsEditingAddress(false)
      toast.success('Address updated successfully')
    } catch (err) {
      console.error('Error updating address:', err)
      toast.error(
        err instanceof Error ? err.message : 'Failed to update address'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    fetchPlan()
    fetchAddress()
  }, [user])

  const handleChangePlan = () => {
    router.push('/dashboard/plans')
  }

  const downloadInvoice = (invoiceId: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log(`Downloading invoice ${invoiceId}`)
    }, 1000)
  }

  if (loadingPlan) {
    return (
      <div className='flex justify-center p-8'>
        Carregando informações do plano...
      </div>
    )
  }

  if (user?.type === 'CLIENT') {
    return (
      <div className='space-y-8'>
        <h2 className='text-xl font-bold'>Informações de Faturamento</h2>
        <Card>
          <CardContent className='p-6 text-center'>
            <div className='space-y-4'>
              <h3 className='text-2xl font-bold'>Adquira um Plano!</h3>
              <p className='text-gray-600'>
                Desbloqueie recursos exclusivos e comece a expandir seu negócio
                como prestador de serviços.
              </p>
              <Button onClick={handleChangePlan} className='mt-4'>
                Conheça os Planos <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className='space-y-8'>
        <h2 className='text-xl font-bold'>Informações de Faturamento</h2>
        <Card>
          <CardContent className='p-6'>
            <div className='text-center space-y-4'>
              <h3 className='text-xl font-bold text-red-500'>
                Error Loading Plan
              </h3>
              <p className='text-gray-600'>
                {error || 'Failed to load plan information'}
              </p>
              <div className='flex justify-center gap-4'>
                <Button variant='outline' onClick={fetchPlan}>
                  Try Again
                </Button>
                <Button onClick={handleChangePlan}>Change Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderBillingInformation = () => (
    <Card>
      <CardContent className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium'>Informações de Faturamento</h3>
          {!isEditingAddress && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsEditingAddress(true)}
            >
              Atualizar Informações
            </Button>
          )}
        </div>

        {isEditingAddress ? (
          <form onSubmit={handleAddressUpdate} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='street'>Endereço</label>
              <Input
                id='street'
                name='street'
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='city'>Cidade</Label>
                <Input
                  id='city'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='state'>Estado</Label>
                <Input
                  id='state'
                  name='state'
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='zip'>CEP</Label>
                <Input
                  id='zip'
                  name='zip'
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='country'>País</Label>
                <Input
                  id='country'
                  name='country'
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className='flex justify-end gap-2 pt-2'>
              <Button
                variant='outline'
                onClick={() => setIsEditingAddress(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        ) : (
          <div className='space-y-4'>
            <div>
              <p className='font-medium'>Endereço de Cobrança</p>
              {address ? (
                <p className='text-gray-500 dark:text-gray-400'>
                  {address.street}
                  <br />
                  {address.city}, {address.state} - {address.zip}
                  <br />
                  {address.country}
                </p>
              ) : (
                <p className='text-gray-500 dark:text-gray-400'>
                  Nenhum endereço cadastrado
                </p>
              )}
            </div>
            <div>
              <p className='font-medium'>Informações Fiscais</p>
              <p className='text-gray-500 dark:text-gray-400'>
                {user?.provider?.cpf ||
                  user?.client?.cpf ||
                  'Nenhum CPF cadastrado'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className='space-y-8'>
      <h2 className='text-xl font-bold'>Informações de Faturamento</h2>

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Plano Atual</h3>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <h4 className='text-xl font-bold'>{plan.name}</h4>
                <Badge className='bg-blue-500 hover:bg-blue-600'>Ativo</Badge>
              </div>
              <p className='text-gray-500 dark:text-gray-400 mt-1'>
                {plan.description} • Próxima cobrança em{' '}
                {new Date().toLocaleDateString('pt-BR')}
              </p>
              <ul className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-2'>
                {plan.features.map((feature) => (
                  <li key={feature.id} className='flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
                    <span className='text-sm'>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-center md:text-right'>
                <span className='text-3xl font-bold'>
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </span>
                <span className='text-gray-500 dark:text-gray-400'>/mês</span>
              </div>
              <Button onClick={handleChangePlan}>Alterar Plano</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium'>Métodos de Pagamento</h3>
            <Button
              onClick={() => setIsPaymentModalOpen(true)}
              variant='outline'
              className='flex items-center gap-1'
            >
              <Plus className='h-4 w-4' /> Adicionar Cartão
            </Button>
          </div>

          <div className='space-y-3'>
            {paymentMethods.map((card) => (
              <div
                key={card.id}
                className={`flex items-center justify-between p-4 border rounded-md ${
                  card.isDefault
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    : ''
                }`}
              >
                <div className='flex items-center gap-4'>
                  <CreditCard
                    className={`h-8 w-8 ${
                      card.isDefault ? 'text-blue-500' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium capitalize'>
                        {card.type} terminando em {card.last4}
                      </p>
                      {card.isDefault && (
                        <Badge
                          variant='outline'
                          className='bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                        >
                          Padrão
                        </Badge>
                      )}
                    </div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Expira em {card.expMonth}/{card.expYear}
                    </p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  {!card.isDefault && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setDefaultCard(card.id)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    >
                      <Check className='h-4 w-4 mr-1' /> Definir como padrão
                    </Button>
                  )}
                  {paymentMethods.length > 1 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => removeCard(card.id)}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                      disabled={card.isDefault}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium'>Histórico de Faturas</h3>
          </div>
          <div className='space-y-4'>
            {[
              {
                id: 'INV-2023-001',
                date: '01/05/2023',
                amount: `R$ ${plan.price.toFixed(2).replace('.', ',')}`,
                status: 'Pago',
              },
              {
                id: 'INV-2023-002',
                date: '01/04/2023',
                amount: `R$ ${plan.price.toFixed(2).replace('.', ',')}`,
                status: 'Pago',
              },
              {
                id: 'INV-2023-003',
                date: '01/03/2023',
                amount: `R$ ${plan.price.toFixed(2).replace('.', ',')}`,
                status: 'Pago',
              },
            ].map((invoice) => (
              <div
                key={invoice.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md'
              >
                <div className='flex items-center space-x-3'>
                  <Calendar className='h-5 w-5 text-gray-500' />
                  <div>
                    <p className='font-medium'>{invoice.id}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {invoice.date}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='font-medium'>{invoice.amount}</p>
                    <Badge
                      variant='outline'
                      className='bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => downloadInvoice(invoice.id)}
                    disabled={isLoading}
                  >
                    <Download className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className='bg-gray-50 dark:bg-gray-800 border-t px-6 py-4'>
          <Button variant='outline' className='w-full'>
            Ver Todas as Faturas
          </Button>
        </CardFooter>
      </Card>

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onAddCard={addCard}
        existingCards={paymentMethods}
      />

      {renderBillingInformation()}
    </div>
  )
}

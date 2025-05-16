'use client'

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Plan } from '../../plans/services/plans'

interface CheckoutFormProps {
  plan: Plan | null
  billingCycle: 'monthly' | 'annual'
  onSubmit: (method: 'credit_card', paymentMethodId: string) => Promise<void>
  isProcessing: boolean
}

export function CheckoutForm({
  plan,
  billingCycle,
  onSubmit,
  isProcessing,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  if (!plan) {
    return (
      <div className='p-6 text-center text-red-500'>
        Nenhum plano selecionado
      </div>
    )
  }

  const getFormattedPrice = () => {
    if (!plan || typeof plan !== 'object' || typeof plan.price !== 'number') {
      console.error('Plano inválido:', plan)
      return '0.00'
    }

    const basePrice = Number(plan.price) || 0
    const finalPrice =
      billingCycle === 'monthly' ? basePrice : basePrice * 12 * 0.9
    return finalPrice.toFixed(2)
  }

  const formattedPrice = getFormattedPrice()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Elemento de cartão não encontrado')
      return
    }

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        })

      if (stripeError) throw stripeError
      if (!paymentMethod?.id)
        throw new Error('Falha ao criar método de pagamento')

      await onSubmit('credit_card', paymentMethod.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>Finalizar Compra</h2>

      <div className='mb-6'>
        <h3 className='font-medium mb-2'>Resumo do Plano</h3>
        <div className='border p-4 rounded-lg'>
          <div className='flex justify-between'>
            <span>
              {plan.name} ({billingCycle === 'monthly' ? 'Mensal' : 'Anual'})
            </span>
            <span className='font-medium'>R${formattedPrice}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <h3 className='font-medium mb-2'>Informações de Pagamento</h3>
          <div className='border rounded-lg p-4'>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && <div className='text-red-600 mb-4'>{error}</div>}

        <Button
          type='submit'
          className='w-full'
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
        </Button>
      </form>
    </div>
  )
}


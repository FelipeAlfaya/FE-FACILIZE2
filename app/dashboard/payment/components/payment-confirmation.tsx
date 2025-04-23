'use client'

import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Download, Home } from 'lucide-react'
import Link from 'next/link'
import type { PaymentDetails } from './payment-flow'

type PaymentConfirmationProps = {
  paymentDetails: PaymentDetails
  onNewPayment: () => void
}

export function PaymentConfirmation({
  paymentDetails,
  onNewPayment,
}: PaymentConfirmationProps) {
  const { plan, billingCycle, paymentMethod } = paymentDetails

  if (!plan) return null

  const price =
    billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual
  const orderId = `FAC${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')}`
  const date = new Date().toLocaleDateString('pt-BR')

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito'
      case 'pix':
        return 'PIX'
      case 'boleto':
        return 'Boleto Bancário'
      default:
        return method
    }
  }

  return (
    <CardContent className='p-6'>
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <CheckCircle className='h-8 w-8 text-green-600' />
        </div>
        <h2 className='text-2xl font-bold mb-2'>Pagamento Confirmado!</h2>
        <p className='text-gray-600'>
          Seu pagamento foi processado com sucesso e seu plano foi ativado.
        </p>
      </div>

      <div className='bg-gray-50 p-6 rounded-lg mb-8 max-w-md mx-auto'>
        <h3 className='text-lg font-medium mb-4'>Detalhes da Compra</h3>

        <div className='space-y-4'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Número do Pedido:</span>
            <span className='font-medium'>{orderId}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Data:</span>
            <span>{date}</span>
          </div>

          <Separator />

          <div className='flex justify-between'>
            <span className='text-gray-600'>Plano:</span>
            <span>{plan.name}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Período:</span>
            <span>{billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Método de Pagamento:</span>
            <span>{getPaymentMethodName(paymentMethod)}</span>
          </div>

          <Separator />

          <div className='flex justify-between font-bold'>
            <span>Total:</span>
            <span>R${price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4 justify-center'>
        <Button variant='outline' className='gap-2'>
          <Download className='h-4 w-4' />
          Baixar Recibo
        </Button>

        <Button asChild className='gap-2'>
          <Link href='/dashboard'>
            <Home className='h-4 w-4' />
            Ir para o Dashboard
          </Link>
        </Button>

        <Button variant='ghost' onClick={onNewPayment}>
          Fazer Outro Pagamento
        </Button>
      </div>
    </CardContent>
  )
}

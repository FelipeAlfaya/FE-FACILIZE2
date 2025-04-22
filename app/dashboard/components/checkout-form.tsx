'use client'

import type React from 'react'

import { useState } from 'react'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { CreditCard, ArrowLeft, QrCode, Receipt } from 'lucide-react'
import type { Plan, PaymentMethod } from './payment-flow'

type CheckoutFormProps = {
  plan: Plan
  billingCycle: 'monthly' | 'annual'
  onSubmit: (method: PaymentMethod, cardDetails?: any) => void
  isProcessing: boolean
}

export function CheckoutForm({
  plan,
  billingCycle,
  onSubmit,
  isProcessing,
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('credit_card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  })

  const price =
    billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentMethod === 'credit_card') {
      onSubmit(paymentMethod, cardDetails)
    } else {
      onSubmit(paymentMethod)
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    const formattedValue = value
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19)

    setCardDetails({ ...cardDetails, number: formattedValue })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    let formattedValue = value

    if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }

    setCardDetails({ ...cardDetails, expiry: formattedValue })
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
    setCardDetails({ ...cardDetails, cvc: value })
  }

  return (
    <CardContent className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold'>Checkout</h2>
        <Button variant='ghost' size='sm' className='gap-1'>
          <ArrowLeft className='h-4 w-4' /> Voltar
        </Button>
      </div>

      <div className='grid md:grid-cols-5 gap-8'>
        <div className='md:col-span-3'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <h3 className='text-lg font-medium mb-4'>Método de Pagamento</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentMethod)
                }
                className='space-y-3'
              >
                <div
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${
                    paymentMethod === 'credit_card'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value='credit_card' id='credit_card' />
                  <Label
                    htmlFor='credit_card'
                    className='flex items-center cursor-pointer'
                  >
                    <CreditCard className='h-5 w-5 mr-2 text-gray-600' />
                    Cartão de Crédito
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${
                    paymentMethod === 'pix'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value='pix' id='pix' />
                  <Label
                    htmlFor='pix'
                    className='flex items-center cursor-pointer'
                  >
                    <QrCode className='h-5 w-5 mr-2 text-gray-600' />
                    PIX
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${
                    paymentMethod === 'boleto'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value='boleto' id='boleto' />
                  <Label
                    htmlFor='boleto'
                    className='flex items-center cursor-pointer'
                  >
                    <Receipt className='h-5 w-5 mr-2 text-gray-600' />
                    Boleto Bancário
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className='space-y-4'>
                <h3 className='text-lg font-medium mb-4'>Dados do Cartão</h3>

                <div className='space-y-2'>
                  <Label htmlFor='card-number'>Número do Cartão</Label>
                  <Input
                    id='card-number'
                    placeholder='0000 0000 0000 0000'
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='card-name'>Nome no Cartão</Label>
                  <Input
                    id='card-name'
                    placeholder='Nome como aparece no cartão'
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='expiry'>Validade (MM/AA)</Label>
                    <Input
                      id='expiry'
                      placeholder='MM/AA'
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='cvc'>CVC</Label>
                    <Input
                      id='cvc'
                      placeholder='123'
                      value={cardDetails.cvc}
                      onChange={handleCvcChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className='text-center py-6'>
                <div className='bg-gray-100 p-6 rounded-lg inline-block mb-4'>
                  <QrCode className='h-32 w-32 mx-auto text-gray-600' />
                </div>
                <p className='text-sm text-gray-600 mb-2'>
                  Escaneie o código QR com o aplicativo do seu banco para pagar
                </p>
                <p className='text-xs text-gray-500'>
                  O QR code é válido por 30 minutos
                </p>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className='text-center py-6'>
                <Receipt className='h-32 w-32 mx-auto text-gray-600 mb-4' />
                <p className='text-sm text-gray-600 mb-2'>
                  Gere o boleto e pague em qualquer banco ou casa lotérica
                </p>
                <p className='text-xs text-gray-500'>
                  O boleto vence em 3 dias úteis
                </p>
                <Button variant='outline' className='mt-4'>
                  Gerar Boleto
                </Button>
              </div>
            )}

            <div className='mt-8'>
              <Button type='submit' className='w-full' disabled={isProcessing}>
                {isProcessing
                  ? 'Processando...'
                  : `Pagar R$${price.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>

        <div className='md:col-span-2'>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-medium mb-4'>Resumo do Pedido</h3>

            <div className='mb-4'>
              <div className='flex justify-between mb-2'>
                <span className='font-medium'>{plan.name}</span>
                <span>R${price.toFixed(2)}</span>
              </div>
              <div className='text-sm text-gray-600'>
                Plano {billingCycle === 'monthly' ? 'Mensal' : 'Anual'}
              </div>
            </div>

            <Separator className='my-4' />

            <div className='space-y-2 mb-4'>
              <div className='flex justify-between text-sm text-gray-600'>
                <span>Subtotal</span>
                <span>R${price.toFixed(2)}</span>
              </div>

              {billingCycle === 'annual' && (
                <div className='flex justify-between text-sm text-green-600'>
                  <span>Economia anual</span>
                  <span>
                    -R${(plan.priceMonthly * 12 - plan.priceAnnual).toFixed(2)}
                  </span>
                </div>
              )}

              <div className='flex justify-between text-sm text-gray-600'>
                <span>Impostos</span>
                <span>Inclusos</span>
              </div>
            </div>

            <Separator className='my-4' />

            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>R${price.toFixed(2)}</span>
            </div>

            <div className='mt-6 text-xs text-gray-500'>
              <p className='mb-2'>
                Ao finalizar sua compra, você concorda com nossos Termos de
                Serviço e Política de Privacidade.
              </p>
              <p>
                Para planos mensais, sua assinatura será renovada
                automaticamente a cada mês. Para planos anuais, a renovação
                ocorre a cada 12 meses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  )
}

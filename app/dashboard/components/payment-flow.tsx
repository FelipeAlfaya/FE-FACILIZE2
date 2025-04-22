'use client'

import { useState } from 'react'
import { PlanSelection } from './plan-selection'
import { CheckoutForm } from './checkout-form'
import { PaymentConfirmation } from './payment-confirmation'
import { Card } from '@/components/ui/card'
import { Steps } from './steps'

export type Plan = {
  id: string
  name: string
  description: string
  priceMonthly: number
  priceAnnual: number
  features: string[]
}

export type PaymentMethod = 'credit_card' | 'pix' | 'boleto'

export type PaymentDetails = {
  plan: Plan | null
  billingCycle: 'monthly' | 'annual'
  paymentMethod: PaymentMethod
  cardDetails?: {
    number: string
    name: string
    expiry: string
    cvc: string
  }
}

const steps = [
  { id: 'plan', title: 'Plano' },
  { id: 'payment', title: 'Pagamento' },
  { id: 'confirmation', title: 'Confirmação' },
]

export function PaymentFlow() {
  const [currentStep, setCurrentStep] = useState('plan')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    plan: null,
    billingCycle: 'monthly',
    paymentMethod: 'credit_card',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handlePlanSelect = (plan: Plan, billingCycle: 'monthly' | 'annual') => {
    setPaymentDetails({
      ...paymentDetails,
      plan,
      billingCycle,
    })
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = (
    method: PaymentMethod,
    cardDetails?: PaymentDetails['cardDetails']
  ) => {
    setPaymentDetails({
      ...paymentDetails,
      paymentMethod: method,
      cardDetails,
    })
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      setCurrentStep('confirmation')
    }, 2000)
  }

  const handleNewPayment = () => {
    setPaymentDetails({
      plan: null,
      billingCycle: 'monthly',
      paymentMethod: 'credit_card',
    })
    setIsComplete(false)
    setCurrentStep('plan')
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <Steps steps={steps} currentStep={currentStep} />

      <Card className='mt-8'>
        {currentStep === 'plan' && (
          <PlanSelection onSelectPlan={handlePlanSelect} />
        )}

        {currentStep === 'payment' && paymentDetails.plan && (
          <CheckoutForm
            plan={paymentDetails.plan}
            billingCycle={paymentDetails.billingCycle}
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 'confirmation' &&
          isComplete &&
          paymentDetails.plan && (
            <PaymentConfirmation
              paymentDetails={paymentDetails}
              onNewPayment={handleNewPayment}
            />
          )}
      </Card>
    </div>
  )
}

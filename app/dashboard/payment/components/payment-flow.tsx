'use client'
import { useState } from 'react'
import { PlanSelection } from '../../plans/components/plan-selection'
import { CheckoutForm } from '../../components/checkout-form'
import { PaymentConfirmation } from './payment-confirmation'
import { Card } from '@/components/ui/card'
import { Steps } from '../../components/steps'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export type Plan = {
  id: number
  name: string
  price: number
  description: string
  billingInterval: 'month' | 'year'
  trialPeriodDays: number
  stripeProductId: string
  stripePriceId: string
  isActive: boolean
  serviceLimit: number
  monthlyAppointmentsLimit: number
}

export type PaymentMethod = 'credit_card' | 'pix' | 'boleto'

export type PaymentDetails = {
  plan: Plan | null
  billingCycle: 'monthly' | 'annual'
  paymentMethod: PaymentMethod
  subscription?: {
    id: string
    status: string
    requiresAction?: boolean
  }
}

const steps = [
  { id: 'plan', title: 'Plano' },
  { id: 'payment', title: 'Pagamento' },
  { id: 'confirmation', title: 'Confirmação' },
]

export interface PaymentFlowProps {
  onComplete?: () => void | Promise<void>
  initialPlan?: Plan | null
}

export function PaymentFlow({ onComplete, initialPlan }: PaymentFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState('plan')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    plan: null,
    billingCycle: 'monthly',
    paymentMethod: 'credit_card',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlanSelect = (plan: Plan, billingCycle: 'monthly' | 'annual') => {
    if (!plan.price || typeof plan.price !== 'number') {
      console.error('Invalid price detected!')
      plan.price = 0
    }

    setPaymentDetails({
      ...paymentDetails,
      plan,
      billingCycle,
    })
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async (
    method: PaymentMethod,
    paymentMethodId: string
  ) => {
    if (!paymentDetails.plan) return

    setIsProcessing(true)
    setError(null)

    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (!token) {
        throw new Error('Usuário não autenticado')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}payments/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: paymentDetails.plan.id,
            paymentMethodId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Falha ao criar assinatura')
      }

      const subscriptionData = await response.json()

      setPaymentDetails({
        ...paymentDetails,
        subscription: {
          id: subscriptionData.subscriptionId,
          status: subscriptionData.status,
          requiresAction: subscriptionData.requiresAction,
        },
      })

      setIsComplete(true)
      setCurrentStep('confirmation')
      if (onComplete) onComplete()
    } catch (err) {
      console.error('Erro no pagamento:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao processar seu pagamento'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewPayment = () => {
    setPaymentDetails({
      plan: null,
      billingCycle: 'monthly',
      paymentMethod: 'credit_card',
    })
    setIsComplete(false)
    setCurrentStep('plan')
    router.refresh()
  }

  return (
    <Elements stripe={stripePromise}>
      <div className='max-w-3xl mx-auto'>
        <Steps steps={steps} currentStep={currentStep} />

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

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
                onNewPayment={() => {
                  setPaymentDetails({
                    plan: null,
                    billingCycle: 'monthly',
                    paymentMethod: 'credit_card',
                  })
                  setIsComplete(false)
                  setCurrentStep('plan')
                }}
              />
            )}
        </Card>
      </div>
    </Elements>
  )
}

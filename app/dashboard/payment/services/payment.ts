import { PaymentMethod } from '@stripe/stripe-js'

interface Subscription {
  clientSecret: string | null
  subscriptionId: string
  requiresAction: boolean
  nextAction: any | null
}

const access_token =
  localStorage.getItem('access_token') || sessionStorage.getItem('access_token')

export const createPaymentMethod = async (
  token: string
): Promise<PaymentMethod> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}payments/payment-methods`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        type: 'card',
        token,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to create payment method')
  }

  return response.json()
}

export const createSubscription = async (
  planId: number,
  paymentMethodId: string
): Promise<Subscription> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}payments/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        planId,
        paymentMethodId,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to create subscription')
  }

  return response.json()
}

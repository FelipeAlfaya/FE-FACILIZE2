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

export async function fetchPlans(): Promise<Plan[]> {
  const response = await fetch('http://localhost:3000/plans')
  if (!response.ok) {
    throw new Error('Failed to fetch plans')
  }
  return response.json()
}

export async function fetchPlanById(id: number): Promise<Plan> {
  const response = await fetch(`http://localhost:3000/plans/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch plan')
  }
  return response.json()
}

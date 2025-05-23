'use client'

import { useState, useEffect } from 'react'
import { Check, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchPlans, type Plan } from '../services/plans'

type PlanSelectionProps = {
  onSelectPlan: (plan: Plan, billingCycle: 'monthly' | 'annual') => void
}

export function PlanSelection({ onSelectPlan }: PlanSelectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans()
        setPlans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plans')
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [])

  const handleContinue = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan, billingCycle)
    }
  }

  if (loading) {
    return <div className='p-6 text-center'>Carregando planos...</div>
  }

  if (error) {
    return <div className='p-6 text-center text-red-500'>{error}</div>
  }

  return (
    <CardContent className='p-6'>
      <h2 className='text-xl font-bold mb-6'>Escolha seu plano</h2>

      <div className='flex justify-center mb-8'>
        <Tabs
          defaultValue='monthly'
          className='w-full max-w-md'
          onValueChange={(value) =>
            setBillingCycle(value as 'monthly' | 'annual')
          }
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='monthly'>Mensal</TabsTrigger>
            <TabsTrigger value='annual'>Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='grid gap-6 md:grid-cols-3 mb-8'>
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id
          const price =
            billingCycle === 'monthly' ? plan.price : plan.price * 12 * 0.9 // 10% discount for annual

          return (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-black'
                  : 'border hover:border-blue-300'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='font-bold'>{plan.name}</h3>
                  <p className='text-sm text-gray-600'>{plan.description}</p>
                </div>
                {isSelected && (
                  <div className='bg-blue-600 text-white rounded-full p-1'>
                    <CheckCircle className='h-4 w-4' />
                  </div>
                )}
              </div>

              <div className='mb-4'>
                <div className='text-2xl font-bold'>
                  R${price.toFixed(2)}
                  <span className='text-sm font-normal text-gray-500 ml-1'>
                    /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <div className='text-sm text-green-600 mt-1'>
                    Economize 10%
                  </div>
                )}
              </div>

              <ul className='space-y-2 mb-4'>
                <li className='flex text-sm'>
                  <Check className='h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                  <span>{plan.serviceLimit} serviços</span>
                </li>
                <li className='flex text-sm'>
                  <Check className='h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                  <span>{plan.monthlyAppointmentsLimit} agendamentos/mês</span>
                </li>
                <li className='flex text-sm'>
                  <Check className='h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                  <span>
                    {plan.trialPeriodDays > 0
                      ? `${plan.trialPeriodDays} dias grátis`
                      : 'Sem período de teste'}
                  </span>
                </li>
              </ul>
            </div>
          )
        })}
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan}
          className='w-full md:w-auto'
        >
          Continuar
        </Button>
      </div>
    </CardContent>
  )
}

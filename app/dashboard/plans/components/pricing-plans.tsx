'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { fetchPlans, type Plan } from '../services/plans'

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState('monthly')
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

  if (loading) {
    return <div className='text-center py-8'>Carregando planos...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-red-500'>{error}</div>
  }

  return (
    <div>
      <div className='flex justify-center mb-8'>
        <Tabs
          defaultValue='monthly'
          className='w-full max-w-md'
          onValueChange={setBillingCycle}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='monthly'>Mensal</TabsTrigger>
            <TabsTrigger value='annual'>Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {plans.map((plan, index) => {
          const isPopular = index === 1 // Make the middle plan popular
          const price =
            billingCycle === 'monthly' ? plan.price : plan.price * 12 * 0.9 // 10% discount for annual

          return (
            <Card
              key={plan.id}
              className={`flex flex-col bg-card text-card-foreground ${
                isPopular
                  ? 'border-blue-500 dark:border-blue-400 shadow-lg'
                  : ''
              }`}
            >
              {isPopular && (
                <div className='bg-blue-500 text-white text-center py-1 text-xs font-medium'>
                  MAIS POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className='text-center'>
                  <div className='text-lg font-bold'>{plan.name}</div>
                  <div className='text-sm font-normal text-gray-500 mt-1'>
                    {plan.description}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <div className='text-center mb-6'>
                  <div className='inline-flex items-baseline'>
                    <span className='text-3xl font-bold'>
                      R${price.toFixed(2)}
                    </span>
                    <span className='text-sm text-gray-500 ml-1'>
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className='text-sm text-green-600 mt-1'>
                      Economize 10%
                    </div>
                  )}
                </div>

                <ul className='space-y-3'>
                  <li className='flex'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span className='text-sm'>
                      {plan.serviceLimit} serviços
                    </span>
                  </li>
                  <li className='flex'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span className='text-sm'>
                      {plan.monthlyAppointmentsLimit} agendamentos/mês
                    </span>
                  </li>
                  <li className='flex'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span className='text-sm'>
                      {plan.trialPeriodDays > 0
                        ? `${plan.trialPeriodDays} dias grátis`
                        : 'Sem período de teste'}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }`}
                  asChild
                >
                  <Link href={`/dashboard/payment?plan=${plan.id}`}>
                    Assinar Plano
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className='mt-12 text-center'>
        <h2 className='text-xl font-bold mb-4'>
          Precisa de um plano personalizado?
        </h2>
        <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
          Entre em contato com nossa equipe para criar um plano que atenda às
          necessidades específicas da sua empresa.
        </p>
        <Button variant='outline' size='lg'>
          Falar com um consultor
        </Button>
      </div>
    </div>
  )
}

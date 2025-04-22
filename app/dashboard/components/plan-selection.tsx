'use client'

import { useState } from 'react'
import { Check, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Plan } from './payment-flow'

type PlanSelectionProps = {
  onSelectPlan: (plan: Plan, billingCycle: 'monthly' | 'annual') => void
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'BÁSICO',
    description: 'Para profissionais autônomos',
    priceMonthly: 49.9,
    priceAnnual: 508.8,
    features: [
      'Emissão de 20 notas fiscais por mês',
      'Controle de 10 clientes',
      'Agenda de compromissos',
      'Suporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    description: 'Para pequenas empresas',
    priceMonthly: 89.9,
    priceAnnual: 712.9,
    features: [
      'Emissão de 50 notas fiscais por mês',
      'Controle de 30 clientes',
      'Agenda de compromissos',
      'Relatórios financeiros',
      'Suporte prioritário',
    ],
  },
  {
    id: 'proplus',
    name: 'PRO+',
    description: 'Para empresas em crescimento',
    priceMonthly: 149.9,
    priceAnnual: 916.9,
    features: [
      'Emissão ilimitada de notas fiscais',
      'Controle ilimitado de clientes',
      'Agenda de compromissos',
      'Relatórios financeiros avançados',
      'Integração com sistemas de contabilidade',
      'Suporte 24/7',
    ],
  },
]

export function PlanSelection({ onSelectPlan }: PlanSelectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const handleContinue = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan, billingCycle)
    }
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
            billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual

          return (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
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
                    Economize{' '}
                    {Math.round(
                      (1 - plan.priceAnnual / (plan.priceMonthly * 12)) * 100
                    )}
                    %
                  </div>
                )}
              </div>

              <ul className='space-y-2 mb-4'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex text-sm'>
                    <Check className='h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                    <span>{feature}</span>
                  </li>
                ))}
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

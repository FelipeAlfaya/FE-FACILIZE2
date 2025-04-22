'use client'

import { useState } from 'react'
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

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
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
      cta: 'Assinar Plano',
      popular: false,
    },
    {
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
      cta: 'Assinar Plano',
      popular: true,
    },
    {
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
      cta: 'Assinar Plano',
      popular: false,
    },
  ]

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
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              plan.popular ? 'border-blue-500 shadow-lg' : ''
            }`}
          >
            {plan.popular && (
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
                    R$
                    {billingCycle === 'monthly'
                      ? plan.priceMonthly.toFixed(2)
                      : plan.priceAnnual.toFixed(2)}
                  </span>
                  <span className='text-sm text-gray-500 ml-1'>
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

              <ul className='space-y-3'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
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

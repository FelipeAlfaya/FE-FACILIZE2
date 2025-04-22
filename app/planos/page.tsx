'use client'
import Footer from '@/components/footer'
import Header from '@/components/header'
import PricingCardDetailed from '@/components/pricing-card-detailed'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function Planos() {
  const [annualBilling, setAnnualBilling] = useState(false)

  const plans = [
    {
      title: 'PLANO BÁSICO',
      monthlyPrice: '49,90',
      annualPrice: '508,80',
      period: annualBilling ? 'por ano' : 'por mês',
      features: [
        'Emissão de notas fiscais ilimitadas',
        'Controle de clientes',
        'Chatbot integrado ao WhatsApp',
      ],
      highlight: false,
    },
    {
      title: 'PLANO PRO',
      monthlyPrice: '69,90',
      annualPrice: '712,80',
      period: annualBilling ? 'por ano' : 'por mês',
      features: [
        'Emissão de notas fiscais ilimitadas',
        'Controle de clientes avançado',
        'Chatbot integrado ao WhatsApp',
        'Relatórios avançados',
      ],
      highlight: true,
    },
    {
      title: 'PLANO PRO+',
      monthlyPrice: '89,90',
      annualPrice: '916,80',
      period: annualBilling ? 'por ano' : 'por mês',
      features: [
        'Emissão de notas fiscais ilimitadas',
        'Controle de clientes avançado',
        'Chatbot integrado ao WhatsApp',
        'Relatórios avançados',
        'Suporte prioritário',
      ],
      highlight: false,
    },
  ]

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Header />

      <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Encontre o plano perfeito para o seu negócio
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Escolha o plano que melhor se adapta às suas necessidades e comece a
            simplificar sua gestão hoje mesmo.
          </p>
        </div>

        <div className='flex justify-center items-center mb-12'>
          <div className='flex items-center space-x-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
            <Label
              htmlFor='billing-mode'
              className='text-gray-700 dark:text-gray-300'
            >
              Cobrança Mensal
            </Label>
            <Switch
              id='billing-mode'
              checked={annualBilling}
              onCheckedChange={setAnnualBilling}
              className='data-[state=checked]:bg-blue-600'
            />
            <Label
              htmlFor='billing-mode'
              className='text-gray-700 dark:text-gray-300'
            >
              Cobrança Anual
              <span className='ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-xs px-2 py-1 rounded-full'>
                15% OFF
              </span>
            </Label>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {plans.map((plan, index) => (
            <PricingCardDetailed
              key={index}
              title={plan.title}
              price={annualBilling ? plan.annualPrice : plan.monthlyPrice}
              period={plan.period}
              features={plan.features}
              buttonText='Começar agora'
              highlighted={plan.highlight}
              discount={annualBilling ? '15% de desconto' : undefined}
            />
          ))}
        </div>

        <div className='mt-16 text-center'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm inline-block max-w-2xl'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
              Precisa de algo personalizado?
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>
              Entre em contato com nosso time para discutir uma solução sob
              medida para o seu negócio.
            </p>
            <button className='px-6 py-2 bg-transparent border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
              Fale com um especialista
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

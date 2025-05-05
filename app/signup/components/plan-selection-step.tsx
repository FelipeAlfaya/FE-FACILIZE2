import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Plan } from '@/app/dashboard/plans/services/plans'

interface PlanSelectionStepProps {
  formData: any
  selectedPlanId: number | null
  setSelectedPlanId: (id: number | null) => void
  loadingPlans: boolean
  plans: Plan[]
}

export default function PlanSelectionStep({
  formData,
  selectedPlanId,
  setSelectedPlanId,
  loadingPlans,
  plans,
}: PlanSelectionStepProps) {
  return (
    <motion.div
      key='planSelectionStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-5'
    >
      <div className='space-y-6'>
        <div className='text-center mb-4'>
          <h3 className='text-lg font-semibold mb-2'>Escolha seu plano</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Selecione o plano que melhor atende às suas necessidades
          </p>
        </div>

        {loadingPlans ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <div className='flex flex-wrap justify-center gap-4'>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all h-full flex flex-col ${
                  selectedPlanId === plan.id
                    ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/20'
                    : 'hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>{plan.name}</CardTitle>
                  <CardDescription className='text-sm min-h-[40px]'>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-grow pb-4'>
                  <div className='text-2xl font-bold mb-4'>
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                    <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
                      /mês
                    </span>
                  </div>
                  <ul className='space-y-2'>
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
                <CardFooter className='pt-0'>
                  <Button
                    variant={selectedPlanId === plan.id ? 'default' : 'outline'}
                    className={`w-full ${
                      selectedPlanId === plan.id
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : ''
                    }`}
                    size='sm'
                  >
                    {selectedPlanId === plan.id ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

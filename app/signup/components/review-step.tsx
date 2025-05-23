import { CheckCircle2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plan } from '@/app/dashboard/plans/services/plans'
import { format } from 'date-fns'

interface ReviewStepProps {
  formData: any
  selectedPlanId: number | null
  plans: Plan[]
  onSubmit: () => void
}

export default function ReviewStep({
  formData,
  selectedPlanId,
  plans,
  onSubmit,
}: ReviewStepProps) {
  return (
    <motion.div
      key='reviewStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-5'
    >
      <div className='bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-6 text-center'>
        <CheckCircle2 className='h-16 w-16 text-emerald-500 mx-auto mb-4' />
        <h3 className='text-xl font-bold mb-2'>Tudo pronto!</h3>
        <p className='text-gray-600 dark:text-gray-300'>
          Revise suas informações e clique em "Criar conta" para finalizar seu
          cadastro.
        </p>
      </div>

      <div className='space-y-4 mt-4'>
        <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
          <h4 className='font-medium mb-2'>Informações pessoais</h4>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div>
              <p className='text-gray-500 dark:text-gray-400'>Nome:</p>
              <p className='font-medium'>{formData.name}</p>
            </div>
            <div>
              <p className='text-gray-500 dark:text-gray-400'>Email:</p>
              <p className='font-medium'>{formData.email}</p>
            </div>
            <div>
              <p className='text-gray-500 dark:text-gray-400'>Tipo:</p>
              <p className='font-medium'>
                {formData.userType === 'CLIENT' ? 'Cliente' : 'Prestador'}
                {formData.providerType &&
                  ` (${
                    formData.providerType === 'INDIVIDUAL'
                      ? 'Autônomo'
                      : 'Pequeno Time'
                  })`}
              </p>
            </div>
            <div>
              <p className='text-gray-500 dark:text-gray-400'>
                {formData.documentType}:
              </p>
              <p className='font-medium'>{formData.document}</p>
            </div>
          </div>
        </div>

        {formData.userType === 'PROVIDER' && (
          <>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Especialidade</h4>
              <p className='text-sm'>
                {formData.specialty === 'Outro'
                  ? formData.customSpecialty
                  : formData.specialty}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Endereço</h4>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>Endereço:</p>
                  <p className='font-medium'>{formData.street}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>Cidade:</p>
                  <p className='font-medium'>{formData.city}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>Estado:</p>
                  <p className='font-medium'>{formData.state}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>CEP:</p>
                  <p className='font-medium'>{formData.zipCode}</p>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Plano selecionado</h4>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>
                    {plans.find((p) => p.id === selectedPlanId)?.name ||
                      'Nenhum plano selecionado'}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {selectedPlanId
                      ? `R$ ${plans
                          .find((p) => p.id === selectedPlanId)
                          ?.price.toFixed(2)
                          .replace('.', ',')} /mês`
                      : ''}
                  </p>
                </div>
                <CreditCard className='h-5 w-5 text-blue-500' />
              </div>
            </div>
          </>
        )}

        {formData.providerType === 'TEAM' && (
          <>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Informações da Empresa</h4>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Razão Social:
                  </p>
                  <p className='font-medium'>{formData.companyName}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Nome Fantasia:
                  </p>
                  <p className='font-medium'>{formData.tradeName || '-'}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>CNPJ:</p>
                  <p className='font-medium'>{formData.document}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>Tipo:</p>
                  <p className='font-medium'>
                    {formData.companyType === 'mei' &&
                      'MEI - Microempreendedor Individual'}
                    {formData.companyType === 'me' && 'ME - Microempresa'}
                    {formData.companyType === 'epp' &&
                      'EPP - Empresa de Pequeno Porte'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Data Fundação:
                  </p>
                  <p className='font-medium'>
                    {formData.foundationDate &&
                      format(new Date(formData.foundationDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Responsável:
                  </p>
                  <p className='font-medium'>{formData.legalRepresentative}</p>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Contato Comercial</h4>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>Telefone:</p>
                  <p className='font-medium'>{formData.companyPhone}</p>
                </div>
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Área de Atuação:
                  </p>
                  <p className='font-medium'>{formData.specialty}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        onClick={onSubmit}
        className='w-full mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 h-12'
      >
        Criar conta
      </Button>
    </motion.div>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Building2, User, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProviderTypeStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: { [key: string]: string }
}

export default function ProviderTypeStep({
  formData,
  setFormData,
  errors,
}: ProviderTypeStepProps) {
  return (
    <motion.div
      key='providerTypeStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-5'
    >
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold'>Você é autônomo ou tem um time?</h2>
        <p className='text-gray-500 mt-2'>
          Escolha o tipo de perfil que melhor descreve você
        </p>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Card
          className={`cursor-pointer transition-all ${
            formData.providerType === 'INDIVIDUAL'
              ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          onClick={() =>
            setFormData({ ...formData, providerType: 'INDIVIDUAL' })
          }
        >
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <User className='h-8 w-8 mb-3 text-blue-500' />
            <h3 className='font-medium text-lg'>Autônomo</h3>
            <p className='text-sm text-gray-500 text-center mt-1'>
              Trabalho sozinho e presto serviços individualmente
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            formData.providerType === 'TEAM'
              ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          onClick={() => setFormData({ ...formData, providerType: 'TEAM' })}
        >
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <Users className='h-8 w-8 mb-3 text-blue-500' />
            <h3 className='font-medium text-lg'>Pequeno Time</h3>
            <p className='text-sm text-gray-500 text-center mt-1'>
              Tenho um pequeno time que presta serviços
              <br />
              <span className='text-xs text-blue-500'>
                (Requer CNPJ e Razão Social)
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {errors.providerType && (
        <p className='text-sm text-red-500 mt-2'>{errors.providerType}</p>
      )}
    </motion.div>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { User, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface AccountTypeStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: { [key: string]: string }
}

export default function AccountTypeStep({
  formData,
  setFormData,
  errors,
}: AccountTypeStepProps) {
  return (
    <motion.div
      key='accountTypeStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-5'
    >
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold'>Crie sua conta</h2>
        <p className='text-gray-500 mt-2'>
          Selecione o tipo de conta que deseja criar
        </p>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Card
          className={`cursor-pointer transition-all ${
            formData.userType === 'CLIENT'
              ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          onClick={() => setFormData({ ...formData, userType: 'CLIENT' })}
        >
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <User className='h-8 w-8 mb-3 text-blue-500' />
            <h3 className='font-medium text-lg'>Cliente</h3>
            <p className='text-sm text-gray-500 text-center mt-1'>
              Quero contratar serviços profissionais
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            formData.userType === 'PROVIDER'
              ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          onClick={() => setFormData({ ...formData, userType: 'PROVIDER' })}
        >
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <Building2 className='h-8 w-8 mb-3 text-blue-500' />
            <h3 className='font-medium text-lg'>Prestador</h3>
            <p className='text-sm text-gray-500 text-center mt-1'>
              Quero oferecer meus serviços profissionais
            </p>
          </CardContent>
        </Card>
      </div>
      {errors.userType && (
        <p className='text-sm text-red-500 mt-2'>{errors.userType}</p>
      )}
    </motion.div>
  )
}

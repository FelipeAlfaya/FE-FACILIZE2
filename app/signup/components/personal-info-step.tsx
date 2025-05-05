import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock, FileText, Phone } from 'lucide-react'
import AnimatedInput from '@/components/animated-input'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChangeEvent } from 'react'
import { formatDocument } from '../utils/signup-utils'

interface PersonalInfoStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: { [key: string]: string }
}

export default function PersonalInfoStep({
  formData,
  setFormData,
  errors,
}: PersonalInfoStepProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    let formattedValue = value

    if (name === 'document') {
      if (formData.documentType === 'CPF') {
        formattedValue = value
          .replace(/\D/g, '')
          .slice(0, 11)
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      } else if (formData.documentType === 'CNPJ') {
        formattedValue = value
          .replace(/\D/g, '')
          .slice(0, 14)
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      }
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue,
    }))
  }

  const handleDocumentTypeChange = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      documentType: value,
      document: '',
    }))
  }

  return (
    <motion.div
      key='personalInfoStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-5'
    >
      <div className='space-y-4'>
        <AnimatedInput
          label='Nome completo'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          icon={<User className='h-4 w-4 text-gray-500' />}
          error={errors.name}
        />

        <AnimatedInput
          label='Email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          required
          icon={<Mail className='h-4 w-4 text-gray-500' />}
          error={errors.email}
        />

        {/* Document Type Selection for CLIENT and PROVIDER (Individual) */}
        {(formData.userType === 'CLIENT' ||
          (formData.userType === 'PROVIDER' &&
            formData.providerType === 'INDIVIDUAL')) && (
          <div className='space-y-2'>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Tipo de documento
            </p>
            <RadioGroup
              // Always CPF for CLIENT, allow choice for PROVIDER INDIVIDUAL
              value={
                formData.userType === 'CLIENT' ? 'CPF' : formData.documentType
              }
              onValueChange={handleDocumentTypeChange}
              className='flex space-x-4'
              // Disable choice for CLIENT
              // disabled={formData.userType === 'CLIENT'}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='CPF'
                  id='cpf'
                  disabled={formData.userType === 'CLIENT'} // Disable CPF option if client
                />
                <Label htmlFor='cpf'>CPF</Label>
              </div>
              {/* Show CNPJ option only for PROVIDER INDIVIDUAL */}
              {formData.userType === 'PROVIDER' &&
                formData.providerType === 'INDIVIDUAL' && (
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='CNPJ' id='cnpj' />
                    <Label htmlFor='cnpj'>CNPJ</Label>
                  </div>
                )}
            </RadioGroup>
            {errors.documentType && (
              <p className='text-xs text-red-500'>{errors.documentType}</p>
            )}
          </div>
        )}

        {/* Document Input - Label changes based on type */}
        <AnimatedInput
          label={formData.documentType === 'CPF' ? 'CPF' : 'CNPJ'}
          name='document'
          value={formData.document}
          onChange={handleChange}
          placeholder={
            formData.documentType === 'CPF'
              ? '000.000.000-00'
              : '00.000.000/0000-00'
          }
          maxLength={formData.documentType === 'CPF' ? 14 : 18}
          required
          icon={<FileText className='h-4 w-4 text-gray-500' />}
          error={errors.document}
        />

        <AnimatedInput
          label='Senha'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          required
          icon={<Lock className='h-4 w-4 text-gray-500' />}
          error={errors.password}
        />
        {/* Basic Password Strength Hint */}
        {formData.password && formData.password.length < 8 && (
          <p className='text-xs text-yellow-600'>
            Senha deve ter pelo menos 8 caracteres.
          </p>
        )}

        <AnimatedInput
          label='Confirmar senha'
          name='confirmPassword'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          icon={<Lock className='h-4 w-4 text-gray-500' />}
          error={errors.confirmPassword}
        />

        <div className='flex items-start space-x-2 pt-2'>
          <Checkbox
            id='terms'
            name='terms'
            checked={formData.terms}
            onCheckedChange={(checked) =>
              setFormData((prev: any) => ({
                ...prev,
                terms: checked === true,
              }))
            }
            aria-describedby='terms-error'
          />
          <div className='grid gap-1.5 leading-none'>
            <label
              htmlFor='terms'
              className='text-sm font-normal text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Eu concordo com os{' '}
              <Link
                href='/legal'
                target='_blank' // Open in new tab
                rel='noopener noreferrer' // Security best practice
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link
                href='/legal'
                target='_blank' // Open in new tab
                rel='noopener noreferrer' // Security best practice
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                Política de Privacidade
              </Link>
            </label>
            {errors.terms && (
              <p id='terms-error' className='text-xs text-red-500'>
                {errors.terms}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


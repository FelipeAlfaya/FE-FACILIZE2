import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'

interface CompanyFormStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: { [key: string]: string }
}

export default function CompanyFormStep({
  formData,
  setFormData,
  errors,
}: CompanyFormStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <motion.div
      key='companyFormStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4'>
        <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-200'>
          Informações da Empresa
        </h3>
        <p className='text-sm text-blue-600 dark:text-blue-300 mt-1'>
          Preencha os dados jurídicos do seu pequeno time
        </p>
      </div>

      <div className='space-y-4'>
        <AnimatedInput
          label='Email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='seu@email.com'
          required
        />

        <AnimatedInput
          label='Senha'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <AnimatedInput
          label='Confirme sua Senha'
          name='confirmPassword'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <AnimatedInput
          label='Razão Social'
          name='companyName'
          value={formData.companyName}
          onChange={handleChange}
          required
        />

        <AnimatedInput
          label='Nome Fantasia'
          name='tradeName'
          value={formData.tradeName}
          onChange={handleChange}
        />

        <AnimatedInput
          label='CNPJ'
          name='document'
          value={formData.document}
          onChange={handleChange}
          placeholder='00.000.000/0000-00'
          maxLength={18}
          required
        />

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Tipo de Empresa</label>
          <RadioGroup
            value={formData.companyType}
            onValueChange={(value) =>
              setFormData({ ...formData, companyType: value })
            }
            className='flex flex-col space-y-2'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='mei' id='mei' />
              <label htmlFor='mei'>MEI - Microempreendedor Individual</label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='me' id='me' />
              <label htmlFor='me'>ME - Microempresa</label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='epp' id='epp' />
              <label htmlFor='epp'>EPP - Empresa de Pequeno Porte</label>
            </div>
          </RadioGroup>
        </div>

        <AnimatedInput
          label='Responsável Legal'
          name='legalRepresentative'
          value={formData.legalRepresentative}
          onChange={handleChange}
          required
        />

        <AnimatedInput
          label='CPF do Responsável'
          name='legalRepresentativeDocument'
          value={formData.legalRepresentativeDocument}
          onChange={handleChange}
          placeholder='000.000.000-00'
          maxLength={14}
          required
        />

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Data de Fundação</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.foundationDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {formData.foundationDate ? (
                  format(formData.foundationDate, 'dd/MM/yyyy', {
                    locale: ptBR,
                  })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={formData.foundationDate}
                onSelect={(date) =>
                  setFormData({ ...formData, foundationDate: date })
                }
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <AnimatedInput
          label='Telefone Comercial'
          name='companyPhone'
          value={formData.companyPhone}
          onChange={handleChange}
          placeholder='(00) 00000-0000'
          required
        />

        <AnimatedInput
          label='Área de Atuação'
          name='specialty'
          value={formData.specialty}
          onChange={handleChange}
          required
        />

        <div className='space-y-2'>
          <label className='text-sm font-medium'>
            Descrição da Empresa (Opcional)
          </label>
          <textarea
            name='companyDescription'
            value={formData.companyDescription}
            onChange={(e) =>
              setFormData({ ...formData, companyDescription: e.target.value })
            }
            className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            placeholder='Descreva brevemente sua empresa, produtos ou serviços...'
          />
        </div>
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
        {errors.companyName && (
          <p className='text-sm text-red-500 mt-2'>{errors.companyName}</p>
        )}
      </div>
      {(errors.email || errors.password || errors.confirmPassword) && (
        <div className='text-sm text-red-500 mt-2 space-y-1'>
          {errors.email && <p>{errors.email}</p>}
          {errors.password && <p>{errors.password}</p>}
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
      )}
    </motion.div>
  )
}


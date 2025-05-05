import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'

interface SpecialtyStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: { [key: string]: string }
}

const specialties = [
  'Advogado',
  'Contador',
  'Consultor Financeiro',
  'Designer',
  'Desenvolvedor',
  'Fotógrafo',
  'Médico',
  'Nutricionista',
  'Psicólogo',
  'Terapeuta',
  'Outro',
]

export default function SpecialtyStep({
  formData,
  setFormData,
  errors,
}: SpecialtyStepProps) {
  return (
    <motion.div
      key='specialtyStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-5'
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='specialty' className='text-base'>
            Especialidade
          </Label>
          <Select
            value={formData.specialty}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                specialty: value,
                customSpecialty:
                  value === 'Outro' ? formData.customSpecialty : '',
              })
            }
          >
            <SelectTrigger id='specialty' className='h-12'>
              <SelectValue placeholder='Selecione sua especialidade' />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.specialty === 'Outro' && (
          <AnimatedInput
            label='Especifique sua especialidade'
            name='customSpecialty'
            value={formData.customSpecialty}
            onChange={(e) =>
              setFormData({ ...formData, customSpecialty: e.target.value })
            }
            required
          />
        )}
      </div>

      {errors.specialty && (
        <p className='text-red-500 text-sm'>{errors.specialty}</p>
      )}
      {errors.customSpecialty && (
        <p className='text-red-500 text-sm'>{errors.customSpecialty}</p>
      )}
    </motion.div>
  )
}


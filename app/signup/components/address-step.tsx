import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'
import { Loader2, MapPin } from 'lucide-react'
import Image from 'next/image'

interface AddressStepProps {
  formData: any
  setFormData: (data: any) => void
  loadingCities: boolean
  cities: string[]
  fetchCitiesByState: (uf: string) => void
  fetchAddressByZipCode: (zipCode: string) => void
  errors: { [key: string]: string }
}

const brazilianStates = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export default function AddressStep({
  formData,
  setFormData,
  loadingCities,
  cities,
  fetchCitiesByState,
  fetchAddressByZipCode,
  errors,
}: AddressStepProps) {
  const getStateName = (uf: string) => {
    const states: Record<string, string> = {
      AC: 'Acre',
      AL: 'Alagoas',
      AP: 'Amapá',
      AM: 'Amazonas',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goiás',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RS: 'Rio Grande do Sul',
      RO: 'Rondônia',
      RR: 'Roraima',
      SC: 'Santa Catarina',
      SP: 'São Paulo',
      SE: 'Sergipe',
      TO: 'Tocantins',
    }
    return states[uf] || uf
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { city: '' } : {}),
    }))

    if (name === 'state') {
      fetchCitiesByState(value)
    }
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = e.target.value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')

    setFormData((prev: any) => ({
      ...prev,
      zipCode: formattedValue,
    }))

    if (formattedValue.length === 9) {
      fetchAddressByZipCode(formattedValue)
    }
  }

  return (
    <motion.div
      key='addressStep'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4'>
        <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2'>
          <MapPin className='h-5 w-5' />
          Endereço Profissional
        </h3>
        <p className='text-sm text-blue-600 dark:text-blue-300 mt-1'>
          Informe o CEP para preenchermos automaticamente seu endereço
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <div className='relative'>
          <AnimatedInput
            label='CEP'
            name='zipCode'
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            placeholder='00000-000'
            maxLength={9}
            required
            icon={<MapPin className='h-5 w-5 text-gray-500' />}
          />
          {/* {formData.zipCode.length === 9 && (
            <button
              type='button'
              onClick={() => fetchAddressByZipCode(formData.zipCode)}
              className='absolute right-2 top-8 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-md transition-colors'
            >
              Buscar
            </button>
          )} */}
        </div>

        {formData.street && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className='space-y-4'
          >
            <AnimatedInput
              label='Endereço'
              name='street'
              value={formData.street}
              onChange={handleChange}
              placeholder='Rua, número, complemento'
              required
              icon={<MapPin className='h-5 w-5 text-gray-500' />}
            />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='w-full'>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleSelectChange('state', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Estado' />
                  </SelectTrigger>
                  <SelectContent>
                    {brazilianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{state}</span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {getStateName(state)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='md:col-span-2'>
                {loadingCities ? (
                  <div className='flex items-center justify-center h-12'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </div>
                ) : (
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleSelectChange('city', value)}
                    disabled={!formData.state || cities.length === 0}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={
                          formData.state
                            ? 'Selecione sua cidade'
                            : 'Selecione o estado primeiro'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.city && (
                        <SelectItem
                          key='auto-filled-city'
                          value={formData.city}
                        >
                          {formData.city}{' '}
                          <span className='text-gray-400 text-xs'>
                            (auto-preenchido)
                          </span>
                        </SelectItem>
                      )}
                      {cities
                        .filter((city) => city !== formData.city)
                        .map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            {/* <AnimatedInput
                  label='Número'
                  name='addressNumber'
                  value={formData.addressNumber}
                  onChange={handleChange}
                  required
                />
                <AnimatedInput
                  label='Bairro'
                  name='neighborhood'
                  value={formData.neighborhood}
                  onChange={handleChange}
                  required
                />
                <AnimatedInput
                  label='Complemento (Opcional)'
                  name='complement'
                  value={formData.complement}
                  onChange={handleChange}
                /> */}

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    País
                  </p>
                  <p className='text-sm'>Brasil</p>
                </div>
                <Image
                  src='/flags/brazil-flag.svg'
                  alt='Bandeira do Brasil'
                  width={24}
                  height={24}
                  className='h-6 w-auto rounded-sm'
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {errors.zipCode && (
        <p className='text-red-500 text-sm'>{errors.zipCode}</p>
      )}
    </motion.div>
  )
}


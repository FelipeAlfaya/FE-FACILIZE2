'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedInput from '@/components/animated-input'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Building2,
  Mail,
  Lock,
  MapPin,
  Check,
  CreditCard,
} from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Plan } from '../dashboard/plans/services/plans'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentFlow } from '../dashboard/payment/components/payment-flow'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface PaymentFlowData {
  clientSecret?: string
  subscriptionId?: string
  requiresAction?: boolean
}

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    document: '',
    userType: 'CLIENT',
    documentType: 'CPF', // Default to CPF
    terms: false,
    // Provider
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    specialty: '',
    customSpecialty: '',
  })
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [paymentFlowData, setPaymentFlowData] =
    useState<PaymentFlowData | null>(null)

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

  useEffect(() => {
    const totalSteps = formData.userType === 'PROVIDER' ? 5 : 2
    setProgress((currentStep / totalSteps) * 100)
  }, [currentStep, formData.userType])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}plans`)

        if (!response.ok) {
          throw new Error('Failed to fetch plans')
        }

        const data = await response.json()
        setPlans(data)
      } catch (error) {
        toast.error('Failed to load plans')
        console.error('Error fetching plans:', error)
      } finally {
        setLoadingPlans(false)
      }
    }

    if (formData.userType === 'PROVIDER' && currentStep === 4) {
      fetchPlans()
    }
  }, [formData.userType, currentStep])

  const fetchCitiesByState = async (uf: string) => {
    try {
      setLoadingCities(true)
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )

      if (!response.ok) {
        throw new Error('Falha ao carregar cidades')
      }

      const data = await response.json()
      const cityNames = data.map((city: any) => city.nome).sort()
      setCities(cityNames)
    } catch (error) {
      toast.error('Falha ao carregar cidades')
      console.error('Erro ao buscar cidades:', error)
    } finally {
      setLoadingCities(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset customSpecialty if specialty is not "Outro"
      ...(name === 'specialty' && value !== 'Outro'
        ? { customSpecialty: '' }
        : {}),
      // Reset city when state changes
      ...(name === 'state' ? { city: '' } : {}),
    }))

    // Fetch cities when state changes
    if (name === 'state') {
      fetchCitiesByState(value)
    }
  }

  const fetchAddressByZipCode = async (zipCode: string) => {
    try {
      const cleanedZipCode = zipCode.replace(/\D/g, '')
      if (cleanedZipCode.length !== 8) return

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedZipCode}/json/`
      )
      if (!response.ok) throw new Error('CEP não encontrado')

      const data = await response.json()
      if (data.erro) throw new Error('CEP não encontrado')

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }))

      // Busca as cidades para o estado encontrado
      if (data.uf) {
        fetchCitiesByState(data.uf)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast.error('Não foi possível encontrar o endereço para este CEP')
    }
  }

  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++)
      sum += Number.parseInt(cpf.substring(i - 1, i)) * (11 - i)
    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++)
      sum += Number.parseInt(cpf.substring(i - 1, i)) * (12 - i)
    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.substring(10, 11))) return false

    return true
  }

  const validateCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false

    let length = cnpj.length - 2
    let numbers = cnpj.substring(0, length)
    const digits = cnpj.substring(length)
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number.parseInt(digits.charAt(0))) return false

    length = length + 1
    numbers = cnpj.substring(0, length)
    sum = 0
    pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number.parseInt(digits.charAt(1))) return false

    return true
  }

  const validateZipCode = (zipCode: string) => {
    const regex = /^\d{5}-?\d{3}$/
    return regex.test(zipCode)
  }

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    if (!formData.document) {
      newErrors.document = `${formData.documentType} é obrigatório`
    } else if (
      formData.documentType === 'CPF' &&
      !validateCPF(formData.document)
    ) {
      newErrors.document = 'CPF inválido'
    } else if (
      formData.documentType === 'CNPJ' &&
      !validateCNPJ(formData.document)
    ) {
      newErrors.document = 'CNPJ inválido'
    }

    if (!formData.terms) {
      newErrors.terms = 'Você deve aceitar os termos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.specialty) {
      newErrors.specialty = 'Especialidade é obrigatória'
    }

    if (formData.specialty === 'Outro' && !formData.customSpecialty) {
      newErrors.customSpecialty = 'Especialidade personalizada é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {}

    if (formData.userType === 'PROVIDER') {
      if (!formData.street) {
        newErrors.street = 'Endereço é obrigatório'
      }
      if (!formData.city) {
        newErrors.city = 'Cidade é obrigatória'
      }
      if (!formData.state) {
        newErrors.state = 'Estado é obrigatório'
      }
      if (!formData.zipCode) {
        newErrors.zipCode = 'CEP é obrigatório'
      } else if (!validateZipCode(formData.zipCode)) {
        newErrors.zipCode = 'CEP inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = () => {
    const newErrors: { [key: string]: string } = {}

    if (!selectedPlanId) {
      newErrors.plan = 'Selecione um plano para continuar'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(formData.userType === 'PROVIDER' ? 2 : 5)
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      if (validateStep3()) {
        setCurrentStep(4)
      }
    } else if (currentStep === 4) {
      if (validateStep4()) {
        setCurrentStep(5)
      }
    } else if (currentStep === 5) {
      handleSubmit()
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else if (currentStep === 3) {
      setCurrentStep(2)
    } else if (currentStep === 4) {
      setCurrentStep(3)
    } else if (currentStep === 5) {
      setCurrentStep(formData.userType === 'PROVIDER' ? 4 : 1)
    }
  }

  const formatDocument = (value: string) => {
    return value.replace(/\D/g, '')
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    const requestData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      type: formData.userType,
      ...(formData.documentType === 'CPF'
        ? { cpf: formatDocument(formData.document) }
        : { cnpj: formatDocument(formData.document) }),
      ...(formData.userType === 'PROVIDER' && {
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode.replace('-', ''),
          country: formData.country,
        },
        specialty:
          formData.specialty === 'Outro'
            ? formData.customSpecialty
            : formData.specialty,
        planId: selectedPlanId,
      }),
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao cadastrar')
      }

      const data = await response.json()

      if (formData.userType === 'PROVIDER' && selectedPlanId) {
        // Salva os dados do usuário temporariamente
        const tempAuthData = {
          email: formData.email,
          password: formData.password,
        }

        // Faz login automaticamente para obter o token
        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempAuthData),
          }
        )

        if (!loginResponse.ok) {
          throw new Error('Falha no login automático para processar pagamento')
        }

        const loginData = await loginResponse.json()
        localStorage.setItem('access_token', loginData.access_token)

        // Mostra o fluxo de pagamento
        setPaymentFlowData({
          clientSecret: loginData.clientSecret,
          subscriptionId: loginData.subscriptionId,
        })
        setShowPaymentFlow(true)
      } else {
        toast.success('Cadastro realizado com sucesso!')
        router.push('/login')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar')
      console.error('Erro no cadastro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPForCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '')

    if (formData.documentType === 'CPF') {
      return numericValue
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    } else {
      // Formatação de CNPJ (00.000.000/0000-00)
      return numericValue
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }
  }

  const formatZipCode = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    return numericValue
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPForCNPJ(e.target.value)
    setFormData((prev) => ({
      ...prev,
      document: formattedValue,
    }))
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatZipCode(e.target.value)
    setFormData((prev) => ({
      ...prev,
      zipCode: formattedValue,
    }))

    // Busca automática quando o CEP estiver completo
    if (formattedValue.length === 9) {
      fetchAddressByZipCode(formattedValue)
    }
  }

  const handleDocumentTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      documentType: value,
      document: '',
    }))
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Informações Básicas'
      case 2:
        return 'Especialidade Profissional'
      case 3:
        return 'Endereço Profissional'
      case 4:
        return 'Escolha do Plano'
      case 5:
        return 'Finalizar Cadastro'
      default:
        return 'Criar Conta'
    }
  }

  const handlePaymentComplete = async () => {
    const signupData = JSON.parse(localStorage.getItem('signup_data') || '{}')

    try {
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signupData.email,
            password: signupData.password,
          }),
        }
      )

      if (!loginResponse.ok) {
        throw new Error('Falha no login automático')
      }

      const loginData = await loginResponse.json()
      localStorage.setItem('access_token', loginData.access_token)
      localStorage.removeItem('signup_data')

      toast.success('Cadastro e pagamento realizados com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Cadastro realizado, mas falha no login automático')
      router.push('/login')
    }
  }

  if (showPaymentFlow) {
    return (
      <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <Header />
        <div className='max-w-4xl mx-auto py-12 px-4'>
          <Elements stripe={stripePromise}>
            <PaymentFlow onComplete={handlePaymentComplete} />
          </Elements>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Header />

      <div className='container max-w-7xl mx-auto px-4 py-8 md:py-12'>
        {/* Progress bar */}
        <div className='max-w-md mx-auto mb-8'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm font-medium'>{getStepTitle()}</span>
            <span className='text-sm font-medium'>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        <div className='grid md:grid-cols-2 gap-8 items-center'>
          {/* Form Column */}
          <motion.div
            className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='mb-6 text-center'>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                Crie sua conta
              </h1>
              <p className='mt-2 text-gray-600 dark:text-gray-300'>
                Já tem uma conta?{' '}
                <Link
                  href='/login'
                  className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                >
                  Entrar
                </Link>
              </p>
            </div>

            <AnimatePresence mode='wait'>
              {currentStep === 1 && (
                <motion.div
                  key='step1'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-5'
                >
                  <div className='bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 mb-6'>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Tipo de conta
                    </p>
                    <div className='grid grid-cols-2 gap-4 mt-3'>
                      <Card
                        className={`cursor-pointer transition-all ${
                          formData.userType === 'CLIENT'
                            ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            userType: 'CLIENT',
                          }))
                        }
                      >
                        <CardContent className='flex flex-col items-center justify-center p-4'>
                          <User
                            className={`h-8 w-8 mb-2 ${
                              formData.userType === 'CLIENT'
                                ? 'text-blue-500'
                                : 'text-gray-400'
                            }`}
                          />
                          <span className='text-sm font-medium'>Cliente</span>
                        </CardContent>
                      </Card>
                      <Card
                        className={`cursor-pointer transition-all ${
                          formData.userType === 'PROVIDER'
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            userType: 'PROVIDER',
                          }))
                        }
                      >
                        <CardContent className='flex flex-col items-center justify-center p-4'>
                          <Building2
                            className={`h-8 w-8 mb-2 ${
                              formData.userType === 'PROVIDER'
                                ? 'text-blue-500'
                                : 'text-gray-400'
                            }`}
                          />
                          <span className='text-sm font-medium'>Prestador</span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <AnimatedInput
                      label='Nome completo'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                      icon={<User className='h-4 w-4 text-gray-500' />}
                    />

                    <AnimatedInput
                      label='Email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                      icon={<Mail className='h-4 w-4 text-gray-500' />}
                    />

                    {formData.userType === 'PROVIDER' && (
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          Tipo de documento
                        </p>
                        <RadioGroup
                          value={formData.documentType}
                          onValueChange={handleDocumentTypeChange}
                          className='flex space-x-4'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='CPF' id='cpf' />
                            <Label htmlFor='cpf'>CPF</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='CNPJ' id='cnpj' />
                            <Label htmlFor='cnpj'>CNPJ</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    <AnimatedInput
                      label={formData.documentType}
                      name='document'
                      value={formData.document}
                      onChange={handleDocumentChange}
                      error={errors.document}
                      placeholder={
                        formData.documentType === 'CPF'
                          ? '000.000.000-00'
                          : '00.000.000/0000-00'
                      }
                      maxLength={formData.documentType === 'CPF' ? 14 : 18}
                      required
                    />

                    <AnimatedInput
                      label='Senha'
                      name='password'
                      type='password'
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      required
                      icon={<Lock className='h-4 w-4 text-gray-500' />}
                    />

                    <AnimatedInput
                      label='Confirmar senha'
                      name='confirmPassword'
                      type='password'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      required
                      icon={<Lock className='h-4 w-4 text-gray-500' />}
                    />

                    <div className='flex items-start space-x-2 pt-2'>
                      <Checkbox
                        id='terms'
                        name='terms'
                        checked={formData.terms}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            terms: checked === true,
                          }))
                        }
                      />
                      <label
                        htmlFor='terms'
                        className='text-sm font-normal leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        Eu concordo com os{' '}
                        <Link
                          href='/legal'
                          className='text-blue-600 dark:text-blue-400 hover:underline'
                        >
                          Termos de Serviço
                        </Link>{' '}
                        e{' '}
                        <Link
                          href='/legal'
                          className='text-blue-600 dark:text-blue-400 hover:underline'
                        >
                          Política de Privacidade
                        </Link>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className='text-xs text-red-500'>{errors.terms}</p>
                    )}
                  </div>
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div
                  key='step2'
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
                          handleSelectChange('specialty', value)
                        }
                      >
                        <SelectTrigger
                          id='specialty'
                          className={`${
                            errors.specialty ? 'border-red-500' : ''
                          } h-12`}
                        >
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
                      {errors.specialty && (
                        <p className='text-xs text-red-500'>
                          {errors.specialty}
                        </p>
                      )}
                    </div>

                    {formData.specialty === 'Outro' && (
                      <AnimatedInput
                        label='Especifique sua especialidade'
                        name='customSpecialty'
                        value={formData.customSpecialty}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customSpecialty: e.target.value,
                          }))
                        }
                        error={errors.customSpecialty}
                        required
                      />
                    )}
                  </div>
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div
                  key='step3'
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
                      Informe o CEP para preenchermos automaticamente seu
                      endereço
                    </p>
                  </div>

                  <div className='grid grid-cols-1 gap-6'>
                    {/* Campo de CEP com busca automática */}
                    <div className='relative'>
                      <AnimatedInput
                        label='CEP'
                        name='zipCode'
                        value={formData.zipCode}
                        onChange={handleZipCodeChange}
                        error={errors.zipCode}
                        placeholder='00000-000'
                        maxLength={9}
                        required
                        icon={
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 text-gray-500'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                          </svg>
                        }
                      />
                      {formData.zipCode.length === 9 && (
                        <button
                          type='button'
                          onClick={() =>
                            fetchAddressByZipCode(formData.zipCode)
                          }
                          className='absolute right-2 top-8 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-md transition-colors'
                        >
                          Buscar
                        </button>
                      )}
                    </div>

                    {/* Campos de endereço que aparecem após a busca */}
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
                          error={errors.street}
                          placeholder='Rua, número, complemento'
                          required
                          icon={<MapPin className='h-5 w-5 text-gray-500' />}
                        />

                        {/* Linha da Cidade e Estado */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          {/* Estado */}
                          <div className='w-full'>
                            <Select
                              value={formData.state}
                              onValueChange={(value) =>
                                handleSelectChange('state', value)
                              }
                            >
                              <SelectTrigger
                                className={`w-full ${
                                  errors.state ? 'border-red-500' : 'border'
                                }`}
                              >
                                <SelectValue placeholder='Estado' />
                              </SelectTrigger>
                              <SelectContent>
                                {brazilianStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    <div className='flex items-center gap-2'>
                                      <span className='font-medium'>
                                        {state}
                                      </span>
                                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                                        {getStateName(state)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.state && (
                              <p className='mt-1 text-xs text-red-500'>
                                {errors.state}
                              </p>
                            )}
                          </div>

                          {/* Cidade */}
                          <div className='md:col-span-2'>
                            {loadingCities ? (
                              <div className='flex items-center justify-center h-12'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                              </div>
                            ) : (
                              <Select
                                value={formData.city}
                                onValueChange={(value) =>
                                  handleSelectChange('city', value)
                                }
                                disabled={
                                  !formData.state || cities.length === 0
                                }
                              >
                                <SelectTrigger
                                  className={`w-full ${
                                    errors.city ? 'border-red-500' : 'border'
                                  }`}
                                >
                                  <SelectValue
                                    placeholder={
                                      formData.state
                                        ? 'Selecione sua cidade'
                                        : 'Selecione o estado primeiro'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Mostra a cidade encontrada pelo CEP como primeira opção */}
                                  {formData.city && (
                                    <SelectItem
                                      key='auto-filled-city'
                                      value={formData.city}
                                    >
                                      {formData.city} (auto-preenchido)
                                    </SelectItem>
                                  )}
                                  {/* Lista todas as cidades disponíveis para o estado */}
                                  {cities
                                    .filter((city) => city !== formData.city) // Remove a cidade já mostrada
                                    .map((city) => (
                                      <SelectItem key={city} value={city}>
                                        {city}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                            {errors.city && (
                              <p className='mt-1 text-xs text-red-500'>
                                {errors.city}
                              </p>
                            )}
                          </div>
                        </div>

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
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key='step4'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-5'
                >
                  {selectedPlanId ? (
                    <Elements stripe={stripePromise}>
                      <PaymentFlow
                        onComplete={() => {
                          toast.success(
                            'Cadastro e pagamento realizados com sucesso!'
                          )
                          router.push('/dashboard')
                        }}
                      />
                    </Elements>
                  ) : (
                    <>
                      <div className='space-y-6'>
                        <div className='text-center mb-4'>
                          <h3 className='text-lg font-semibold mb-2'>
                            Escolha seu plano
                          </h3>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Selecione o plano que melhor atende às suas
                            necessidades
                          </p>
                        </div>

                        {errors.plan && (
                          <div className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm text-center'>
                            {errors.plan}
                          </div>
                        )}

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
                                  <CardTitle className='text-lg'>
                                    {plan.name}
                                  </CardTitle>
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
                                        {plan.monthlyAppointmentsLimit}{' '}
                                        agendamentos/mês
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
                                    variant={
                                      selectedPlanId === plan.id
                                        ? 'default'
                                        : 'outline'
                                    }
                                    className={`w-full ${
                                      selectedPlanId === plan.id
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : ''
                                    }`}
                                    size='sm'
                                  >
                                    {selectedPlanId === plan.id
                                      ? 'Selecionado'
                                      : 'Selecionar'}
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className='flex gap-4 mt-6'>
                        <Button
                          type='button'
                          onClick={handlePrevStep}
                          variant='outline'
                          className='flex-1'
                        >
                          Voltar
                        </Button>
                        <Button
                          type='button'
                          onClick={handleNextStep}
                          className='flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                          disabled={
                            loadingPlans ||
                            (formData.userType === 'PROVIDER' &&
                              !selectedPlanId)
                          }
                        >
                          Próximo
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              {currentStep === 5 && (
                <motion.div
                  key='step5'
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
                      Revise suas informações e clique em "Criar conta" para
                      finalizar seu cadastro.
                    </p>
                  </div>

                  <div className='space-y-4 mt-4'>
                    <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
                      <h4 className='font-medium mb-2'>Informações pessoais</h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div>
                          <p className='text-gray-500 dark:text-gray-400'>
                            Nome:
                          </p>
                          <p className='font-medium'>{formData.name}</p>
                        </div>
                        <div>
                          <p className='text-gray-500 dark:text-gray-400'>
                            Email:
                          </p>
                          <p className='font-medium'>{formData.email}</p>
                        </div>
                        <div>
                          <p className='text-gray-500 dark:text-gray-400'>
                            Tipo:
                          </p>
                          <p className='font-medium'>
                            {formData.userType === 'CLIENT'
                              ? 'Cliente'
                              : 'Prestador'}
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
                              <p className='text-gray-500 dark:text-gray-400'>
                                Endereço:
                              </p>
                              <p className='font-medium'>{formData.street}</p>
                            </div>
                            <div>
                              <p className='text-gray-500 dark:text-gray-400'>
                                Cidade:
                              </p>
                              <p className='font-medium'>{formData.city}</p>
                            </div>
                            <div>
                              <p className='text-gray-500 dark:text-gray-400'>
                                Estado:
                              </p>
                              <p className='font-medium'>{formData.state}</p>
                            </div>
                            <div>
                              <p className='text-gray-500 dark:text-gray-400'>
                                CEP:
                              </p>
                              <p className='font-medium'>{formData.zipCode}</p>
                            </div>
                          </div>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
                          <h4 className='font-medium mb-2'>
                            Plano selecionado
                          </h4>
                          <div className='flex items-center justify-between'>
                            <div>
                              <p className='font-medium'>
                                {plans.find((p) => p.id === selectedPlanId)
                                  ?.name || 'Nenhum plano selecionado'}
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex gap-4 mt-8'>
              {currentStep > 1 && (
                <Button
                  type='button'
                  onClick={handlePrevStep}
                  variant='outline'
                  className='flex-1 h-12'
                  disabled={isLoading}
                >
                  <ChevronLeft className='mr-2 h-4 w-4' />
                  Voltar
                </Button>
              )}
              <motion.div
                className='flex-1'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type='button'
                  onClick={handleNextStep}
                  className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 h-12'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processando...
                    </>
                  ) : currentStep <
                    (formData.userType === 'PROVIDER' ? 5 : 2) ? (
                    <>
                      Próximo
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </>
                  ) : (
                    'Criar conta'
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            className='hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-teal-700 dark:from-blue-800 dark:to-teal-900 rounded-xl p-10 text-white h-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src='/images/logo-transparente.svg'
              alt='Logo Facilize'
              width={200}
              height={200}
              className='w-[180px] h-auto object-cover mx-auto mb-8'
              priority
            />
            <h2 className='text-2xl md:text-3xl font-bold text-center mb-6'>
              Simplifique a gestão do seu negócio
            </h2>
            <motion.ul
              className='space-y-4 text-left max-w-md'
              initial='hidden'
              animate='visible'
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                'Emita notas fiscais em segundos',
                'Gerencie seus clientes em um só lugar',
                'Automatize agendamentos e lembretes',
                'Acesse relatórios detalhados do seu negócio',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className='flex items-start'
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <svg
                    className='mr-3 h-6 w-6 flex-shrink-0 text-blue-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    ></path>
                  </svg>
                  <span className='text-lg'>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <p className='mt-8 text-sm opacity-90 text-center'>
              Mais de 10.000 profissionais já confiam na Facilize para gerenciar
              seus negócios
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

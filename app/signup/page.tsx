'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  PaymentFlow,
  type PaymentFlowProps,
} from '../dashboard/payment/components/payment-flow'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    document: '', // CPF ou CNPJ
    userType: 'CLIENT',
    documentType: 'CPF', // Default to CPF
    terms: false,
  })
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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

    // Validação do primeiro dígito verificador
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

    // Validação do segundo dígito verificador
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    const requestData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      type: formData.userType.toUpperCase(),
      ...(formData.documentType === 'CPF'
        ? { cpf: formatDocument(formData.document) }
        : { cnpj: formatDocument(formData.document) }),
    }

    console.log('Enviando dados:', JSON.stringify(requestData, null, 2))

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
      toast.success('Cadastro realizado com sucesso!')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar')
      console.error('Erro no cadastro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentComplete: PaymentFlowProps['onComplete'] = async () => {
    // await registerUser()
  }

  const formatDocument = (value: string) => {
    return value.replace(/\D/g, '')
  }

  const formatCPForCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '')

    if (formData.documentType === 'CPF') {
      // Formatação de CPF (000.000.000-00)
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPForCNPJ(e.target.value)
    setFormData((prev) => ({
      ...prev,
      document: formattedValue,
    }))
  }

  const handleDocumentTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      documentType: value,
      document: '', // Clear document when changing type
    }))
  }

  if (showPaymentFlow) {
    return (
      <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <Header />
        <div className='max-w-4xl mx-auto py-12 px-4'>
          <h1 className='text-2xl font-bold mb-8 text-center'>
            Escolha seu plano de assinatura
          </h1>
          <PaymentFlow onComplete={handlePaymentComplete} />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Header />

      <div className='w-full gap-10 lg:grid lg:min-h-[600px] lg:grid-cols-2 lg:gap-0 xl:min-h-[800px]'>
        <motion.div
          className='flex items-center justify-center p-6 xl:p-10'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='mx-auto w-full max-w-md space-y-6'>
            <div className='space-y-2 text-center'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Crie sua conta
              </h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Já tem uma conta?{' '}
                <Link
                  href='/login'
                  className='text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Entrar
                </Link>
              </p>
            </div>

            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Tipo de conta
                </p>
                <div className='flex gap-4'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      name='userType'
                      value='CLIENT'
                      checked={formData.userType === 'CLIENT'}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Cliente
                    </span>
                  </label>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      name='userType'
                      value='PROVIDER'
                      checked={formData.userType === 'PROVIDER'}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Prestador de Serviços
                    </span>
                  </label>
                </div>
              </div>

              <AnimatedInput
                label='Nome completo'
                name='name'
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <AnimatedInput
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              {formData.userType === 'PROVIDER' ? (
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
              ) : null}

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
              />

              <AnimatedInput
                label='Confirmar senha'
                name='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
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
                    href='/termos'
                    className='text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link
                    href='/privacidade'
                    className='text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className='text-xs text-red-500'>{errors.terms}</p>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Criando conta...
                    </>
                  ) : (
                    'Criar conta'
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className='hidden items-center justify-center p-6 lg:flex lg:bg-gradient-to-r lg:from-blue-600 lg:to-blue-800 lg:p-10 dark:lg:from-blue-900 dark:lg:to-blue-950'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='mx-auto items-center text-center text-white'>
            <Image
              src='/images/logo-transparente.svg'
              alt='Logo Facilize'
              width={300}
              height={300}
              className='w-[250px] h-auto object-cover mx-auto'
              priority
            />
            <h2 className='mt-6 text-3xl font-bold'>
              Simplifique a gestão do seu negócio
            </h2>
            <motion.ul
              className='mt-8 space-y-4 text-left max-w-md mx-auto'
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
                    className='mr-3 h-6 w-6 flex-shrink-0 text-white'
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
            <p className='mt-8 text-sm opacity-90'>
              Mais de 10.000 profissionais já confiam na Facilize para gerenciar
              seus negócios
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

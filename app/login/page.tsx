'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type AuthResponse = {
  access_token: string
  user: {
    id: number
    email: string
    name: string
    avatar: string | null
    type: 'CLIENT' | 'PROVIDER'
    createdAt: string
    updatedAt: string
    client?: {
      id: number
      userId: number
      cpf: string
    }
    provider?: {
      id: number
      userId: number
      cnpj: string
      description: string
    }
  }
}

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { token, user, isInitialized } = useAuth()

  useEffect(() => {
    if (isInitialized && token && user) {
      const redirectTo =
        user.type === 'CLIENT' ? '/dashboard/providers' : '/dashboard'
      window.location.href = redirectTo
    }
  }, [isInitialized, token, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked)
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_API_PUBLIC_URL}auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Adiciona erros aos campos correspondentes
          setErrors({
            email: 'Credenciais inválidas',
            password: 'Credenciais inválidas',
          })
          throw new Error('Credenciais inválidas. Verifique seu email e senha.')
        } else if (response.status === 404) {
          setErrors({ email: 'Usuário não encontrado' })
          throw new Error('Usuário não encontrado.')
        } else if (response.status === 400) {
          if (data.errors) {
            setErrors(data.errors)
          } else {
            setErrors({ email: data.message || 'Dados inválidos' })
          }
          throw new Error(data.message || 'Dados inválidos fornecidos.')
        } else {
          throw new Error(data.message || 'Erro ao fazer login')
        }
      }

      await login(data.access_token, data.user, rememberMe)

      window.location.href =
        data.user.type === 'CLIENT' ? '/dashboard/providers' : '/dashboard'
    } catch (error) {
      let errorMessage = 'Erro ao fazer login'

      if (error instanceof Error) {
        errorMessage = error.message

        // Tratamento específico para erros de rede
        if (error.message.includes('Failed to fetch')) {
          errorMessage =
            'Não foi possível conectar ao servidor. Verifique sua conexão.'
          setErrors({
            email: errorMessage,
            password: errorMessage,
          })
        }
      }

      toast.error(errorMessage, {
        position: 'top-center',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='min-h-screen'>
      <Header />

      <div className='w-full gap-10 lg:grid lg:min-h-[600px] lg:grid-cols-2 lg:gap-0 xl:min-h-[800px]'>
        <motion.div
          className='flex items-center bg-muted justify-center p-6 xl:p-10'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='mx-auto w-full max-w-md space-y-6'>
            <div className='space-y-2 text-center'>
              <Image
                src='/images/logo-color.svg'
                alt='Logo Facilize'
                width={60}
                height={60}
                className='w-[60px] h-auto object-cover mx-auto'
              />
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Entre na sua conta
              </h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Não tem uma conta?{' '}
                <Link
                  href='/signup'
                  className='text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Cadastre-se
                </Link>
              </p>
            </div>

            <form className='space-y-4' onSubmit={handleSubmit}>
              <AnimatedInput
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <div className='space-y-2'>
                <AnimatedInput
                  label='Senha'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='remember-me'
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                    />
                    <label
                      htmlFor='remember-me'
                      className='text-sm text-gray-700 dark:text-gray-300'
                    >
                      Lembrar de mim
                    </label>
                  </div>
                  <Link
                    href='/forgot-password'
                    className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

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
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
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
              Bem-vindo de volta à Facilize
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
                'Acesse sua conta com segurança',
                'Gerencie seus serviços e clientes',
                'Tenha controle total do seu negócio',
                'Aproveite recursos exclusivos',
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
              Junte-se a mais de 10.000 profissionais que confiam na Facilize
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

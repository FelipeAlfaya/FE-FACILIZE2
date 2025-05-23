'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AnimatedInput from '@/components/animated-input'
import Header from '@/components/header'
import Footer from '@/components/footer'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial')

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const router = useRouter()
  const { token } = params

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validatePassword = () => {
    try {
      passwordSchema.parse(password)
      setPasswordError('')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message)
      }
      return false
    }
  }

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isPasswordValid = validatePassword()
    const isConfirmPasswordValid = validateConfirmPassword()

    if (!isPasswordValid || !isConfirmPasswordValid) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Validate token
      if (token === 'invalid') {
        throw new Error('Token inválido ou expirado')
      }

      setSubmitStatus('success')
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <div className='flex items-center mb-2'>
              <Link
                href='/login'
                className='text-muted-foreground hover:text-primary mr-2'
              >
                <ArrowLeft size={16} />
              </Link>
              <CardTitle>Redefinir senha</CardTitle>
            </div>
            <CardDescription>
              Crie uma nova senha para sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitStatus === 'success' ? (
              <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900'>
                <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                <AlertTitle>Senha redefinida com sucesso</AlertTitle>
                <AlertDescription>
                  Sua senha foi redefinida com sucesso. Agora você pode fazer
                  login com sua nova senha.
                </AlertDescription>
              </Alert>
            ) : submitStatus === 'error' ? (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='relative'>
                  <AnimatedInput
                    label='Nova senha'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                    required
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-2 top-2.5 h-8 w-8 p-0'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    </span>
                  </Button>
                </div>

                <div className='relative'>
                  <AnimatedInput
                    label='Confirmar senha'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPasswordError}
                    required
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-2 top-2.5 h-8 w-8 p-0'
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                    <span className='sr-only'>
                      {showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                    </span>
                  </Button>
                </div>

                <div className='text-xs text-muted-foreground space-y-1'>
                  <p>A senha deve conter:</p>
                  <ul className='list-disc list-inside space-y-0.5'>
                    <li
                      className={
                        password.length >= 8
                          ? 'text-green-500 dark:text-green-400'
                          : ''
                      }
                    >
                      Pelo menos 8 caracteres
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password)
                          ? 'text-green-500 dark:text-green-400'
                          : ''
                      }
                    >
                      Uma letra maiúscula
                    </li>
                    <li
                      className={
                        /[a-z]/.test(password)
                          ? 'text-green-500 dark:text-green-400'
                          : ''
                      }
                    >
                      Uma letra minúscula
                    </li>
                    <li
                      className={
                        /[0-9]/.test(password)
                          ? 'text-green-500 dark:text-green-400'
                          : ''
                      }
                    >
                      Um número
                    </li>
                    <li
                      className={
                        /[^A-Za-z0-9]/.test(password)
                          ? 'text-green-500 dark:text-green-400'
                          : ''
                      }
                    >
                      Um caractere especial
                    </li>
                  </ul>
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Redefinindo...
                    </>
                  ) : (
                    'Redefinir senha'
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className='flex justify-center border-t pt-4'>
            <div className='text-sm text-muted-foreground'>
              {submitStatus === 'success' ? (
                <Button
                  variant='link'
                  onClick={() => router.push('/login')}
                  className='p-0 h-auto'
                >
                  Ir para o login
                </Button>
              ) : (
                <div className='flex gap-1'>
                  Lembrou sua senha?
                  <Link href='/login' className='text-primary hover:underline'>
                    Faça login
                  </Link>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

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
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const emailSchema = z.string().email('Por favor, insira um e-mail válido')

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = () => {
    try {
      emailSchema.parse(email)
      setEmailError('')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitStatus('success')
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
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
              <CardTitle>Recuperar senha</CardTitle>
            </div>
            <CardDescription>
              Insira seu e-mail para receber um link de redefinição de senha
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitStatus === 'success' ? (
              <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900'>
                <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                <AlertTitle>E-mail enviado</AlertTitle>
                <AlertDescription>
                  Enviamos um link de redefinição de senha para {email}. Por
                  favor, verifique sua caixa de entrada e siga as instruções.
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
                <AnimatedInput
                  label='E-mail'
                  name='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                  placeholder='seu@email.com'
                />

                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Enviando...
                    </>
                  ) : (
                    'Enviar link de redefinição'
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
                  Voltar para o login
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

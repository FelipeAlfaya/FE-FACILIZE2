'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'

type VerificationState = 'idle' | 'loading' | 'success' | 'error'

interface EmailVerificationModalProps {
  email: string
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function EmailVerificationModal({
  email,
  onSuccess,
  onError,
}: EmailVerificationModalProps) {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState('')
  const [state, setState] = useState<VerificationState>('idle')
  const [message, setMessage] = useState('')

  // Send verification code when modal is opened
  useEffect(() => {
    if (open) {
      handleSendVerificationCode()
    }
  }, [open])

  const handleSendVerificationCode = async () => {
    if (!email) {
      setMessage('Endereço de email não fornecido.')
      setState('error')
      return
    }

    setState('loading')
    setMessage('Enviando código de verificação...')

    try {
      const response = await fetch(
        'http://localhost:3000/users/send-verification-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            email,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao enviar código')
      }

      setState('idle')
      setMessage('Um código de verificação foi enviado para seu email.')
    } catch (error) {
      setState('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar código de verificação'
      )

      if (onError) {
        onError(
          error instanceof Error
            ? error.message
            : 'Erro ao enviar código de verificação'
        )
      }
    }
  }

  const handleVerify = async () => {
    if (!token.trim()) {
      setMessage('Por favor, insira o código de verificação.')
      setState('error')
      return
    }

    setState('loading')
    setMessage('Verificando seu código...')

    try {
      const response = await fetch(
        'http://localhost:3000/users/verify-email-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            email,
            code: token,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao verificar código')
      }

      setState('success')
      setMessage('Seu email foi verificado com sucesso!')

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setState('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao validar seu email. Por favor, tente novamente.'
      )

      if (onError) {
        onError(
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao validar seu email'
        )
      }
    }
  }

  const resetModal = () => {
    setState('idle')
    setMessage('')
    setToken('')
  }

  return (
    <>
      <Button
        onClick={() => {
          resetModal()
          setOpen(true)
        }}
        variant='outline'
        className='flex items-center gap-2'
      >
        <Mail className='h-4 w-4' />
        Verificar Email
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) resetModal()
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Verificação de Email</DialogTitle>
            <DialogDescription>
              {state === 'idle' &&
                'Insira o código de verificação enviado para seu email.'}
              {state === 'loading' && 'Verificando seu código...'}
              {state === 'success' && 'Seu email foi verificado com sucesso!'}
              {state === 'error' && 'Não foi possível verificar seu email.'}
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col items-center justify-center p-4'>
            {state === 'idle' && (
              <div className='space-y-4 w-full'>
                <div className='space-y-2'>
                  <Label htmlFor='token'>Código de Verificação</Label>
                  <Input
                    id='token'
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder='Digite o código recebido por email'
                  />
                </div>
                {message && <p className='text-sm text-blue-600'>{message}</p>}
              </div>
            )}

            {state === 'loading' && (
              <div className='flex flex-col items-center space-y-4 py-4'>
                <Loader2 className='h-12 w-12 text-primary animate-spin' />
                <p className='text-center text-muted-foreground'>{message}</p>
              </div>
            )}

            {state === 'success' && (
              <div className='flex flex-col items-center space-y-4 py-4'>
                <CheckCircle2 className='h-12 w-12 text-green-500' />
                <p className='text-center text-green-600 font-medium'>
                  {message}
                </p>
                <p className='text-center text-muted-foreground'>
                  Sua conta está agora completamente verificada.
                </p>
              </div>
            )}

            {state === 'error' && (
              <div className='flex flex-col items-center space-y-4 py-4'>
                <XCircle className='h-12 w-12 text-red-500' />
                <p className='text-center text-red-600 font-medium'>
                  {message}
                </p>
                <p className='text-center text-muted-foreground'>
                  O código pode estar incorreto ou ter expirado.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2'>
            {state === 'idle' && (
              <>
                <Button variant='outline' onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2'>
                  <Button
                    variant='secondary'
                    onClick={handleSendVerificationCode}
                  >
                    Reenviar Código
                  </Button>
                  <Button onClick={handleVerify}>Verificar</Button>
                </div>
              </>
            )}

            {state === 'loading' && (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Verificando...
              </Button>
            )}

            {state === 'success' && (
              <Button onClick={() => setOpen(false)}>Concluir</Button>
            )}

            {state === 'error' && (
              <>
                <Button variant='outline' onClick={() => setState('idle')}>
                  Tentar Novamente
                </Button>
                <Button
                  variant='secondary'
                  onClick={handleSendVerificationCode}
                >
                  Reenviar Código
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

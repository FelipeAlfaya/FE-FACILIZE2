'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Smartphone, Laptop, Shield, LogOut } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useUser } from '@/context/UserContext'

export function SecurityTab() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [touchedPassword, setTouchedPassword] = useState(false)
  const { user } = useUser()
  const userId = user?.id

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[\W_]/.test(password)) score++

    return score
  }

  const isFormValid = () => {
    const { oldPassword, newPassword, confirmPassword } = formData
    const passwordScore = getPasswordStrength(newPassword)

    return (
      oldPassword.trim().length > 0 &&
      newPassword.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      passwordScore >= 4
    )
  }

  const PasswordStrengthBar = ({ score }: { score: number }) => {
    const strengthColors = [
      'hsl(var(--destructive))',
      'hsl(var(--warning))',
      'hsl(var(--info))',
      'hsl(var(--primary))',
      'hsl(var(--success))',
    ]
    const labels = ['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte']

    return (
      <div className='space-y-1 mt-1'>
        <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full transition-all duration-300'
            style={{
              width: `${(score / 5) * 100}%`,
              backgroundColor:
                strengthColors[score - 1] || 'hsl(var(--muted-foreground))',
            }}
          />
        </div>
        {score > 0 && (
          <p className='text-sm text-muted-foreground'>
            Força: <span className='font-medium'>{labels[score - 1]}</span>
          </p>
        )}
      </div>
    )
  }
  const passwordStrength = getPasswordStrength(formData.newPassword)

  const validatePassword = (password: string) => {
    const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
    return regex.test(password)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      setShowError('As senhas não coincidem')
      return
    }

    if (!validatePassword(formData.newPassword)) {
      setShowError(
        'A senha deve conter letras maiúsculas, minúsculas, números ou símbolos'
      )
      return
    }

    setIsSubmitting(true)
    setShowError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${userId}/change-password`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao alterar senha')
      }

      setShowSuccess(true)
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      setShowError(
        error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-8'>
      <h2 className='text-xl font-bold'>Segurança da Conta</h2>

      {showSuccess && (
        <Alert variant='success'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Senha atualizada com sucesso!</AlertDescription>
        </Alert>
      )}

      {showError && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{showError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Alterar Senha</h3>
          <form onSubmit={handlePasswordChange} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='current-password'>Senha Atual</Label>
              <Input
                id='current-password'
                name='oldPassword'
                type='password'
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='new-password'>Nova Senha</Label>
              <Input
                id='new-password'
                name='newPassword'
                type='password'
                value={formData.newPassword}
                onChange={handleChange}
                onFocus={() => setTouchedPassword(true)}
                required
                minLength={8}
              />
              {touchedPassword && (
                <PasswordStrengthBar score={passwordStrength} />
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirm-password'>Confirmar Nova Senha</Label>
              <Input
                id='confirm-password'
                name='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <Button type='submit' disabled={isSubmitting || !isFormValid}>
              {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>
            Autenticação de Dois Fatores
          </h3>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='font-medium'>Autenticação de Dois Fatores</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Adicione uma camada extra de segurança à sua conta.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
              aria-label='Toggle two-factor authentication'
            />
          </div>

          {twoFactorEnabled && (
            <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md'>
              <p className='text-sm mb-4'>
                Configure a autenticação de dois fatores escaneando o QR code
                abaixo com o seu aplicativo autenticador.
              </p>
              <div className='flex justify-center mb-4'>
                <div className='w-48 h-48 bg-white dark:bg-gray-700 flex items-center justify-center rounded-md'>
                  <Shield className='h-24 w-24 text-gray-300 dark:text-gray-600' />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='verification-code'>Código de Verificação</Label>
                <Input
                  id='verification-code'
                  placeholder='Digite o código de 6 dígitos'
                />
              </div>
              <Button className='mt-4'>Verificar e Ativar</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Dispositivos Conectados</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 bg-accent dark:rounded-md'>
              <div className='flex items-center space-x-3'>
                <Laptop className='h-8 w-8 text-gray-500' />
                <div>
                  <p className='font-medium'>MacBook Pro - Chrome</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    São Paulo, Brasil • Ativo agora
                  </p>
                </div>
              </div>
              <Button variant='outline' size='sm'>
                <LogOut className='h-4 w-4 mr-2' />
                Desconectar
              </Button>
            </div>

            <div className='flex items-center justify-between p-3 bg-accent dark:rounded-md'>
              <div className='flex items-center space-x-3'>
                <Smartphone className='h-8 w-8 text-gray-500' />
                <div>
                  <p className='font-medium'>iPhone 13 - Safari</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    São Paulo, Brasil • Último acesso: 2 horas atrás
                  </p>
                </div>
              </div>
              <Button variant='outline' size='sm'>
                <LogOut className='h-4 w-4 mr-2' />
                Desconectar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

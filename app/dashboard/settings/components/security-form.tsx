'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Check, AlertCircle } from 'lucide-react'
import { fetchChangePassword } from '@/services/security-api'
import { useUser } from '@/context/UserContext'

export function SecurityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const { user } = useUser()
  const userId = Number(user?.id)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validações básicas
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')

      if (!token) {
        throw new Error('token não encontrado')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${userId}/change-password`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            oldPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('erro fazendo o fetch')
      }

      setShowSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro desconhecido'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-xl font-bold mb-6'>Segurança</h2>

      {showSuccess && (
        <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-6 flex items-center'>
          <Check className='h-5 w-5 mr-2' />
          Senha alterada com sucesso!
        </div>
      )}

      {error && (
        <div className='bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md mb-6 flex items-center'>
          <AlertCircle className='h-5 w-5 mr-2' />
          {error}
        </div>
      )}

      <div className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Alterar Senha</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Atualize sua senha para manter sua conta segura.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='currentPassword'>Senha Atual</Label>
              <Input
                id='currentPassword' // Corrigido para corresponder à chave do estado
                type='password'
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='newPassword'>Nova Senha</Label>
              <Input
                id='newPassword' // Corrigido para corresponder à chave do estado
                type='password'
                value={formData.newPassword}
                onChange={handleChange}
                required
              />

              <p className='text-xs text-muted-foreground mt-1'>
                A senha deve ter pelo menos 8 caracteres e incluir letras
                maiúsculas, minúsculas, números e símbolos.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirmar Nova Senha</Label>
              <Input
                id='confirmPassword' // Corrigido para corresponder à chave do estado
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>
              Autenticação de Dois Fatores
            </h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Adicione uma camada extra de segurança à sua conta.
            </p>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='two-factor' className='font-medium'>
                Autenticação de Dois Fatores
              </Label>
              <p className='text-sm text-muted-foreground'>
                Proteja sua conta com autenticação de dois fatores.
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input type='checkbox' className='sr-only peer' id='two-factor' />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Sessões Ativas</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Gerencie os dispositivos conectados à sua conta.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='border rounded-lg p-4 dark:border-gray-700'>
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='font-medium'>Chrome em Windows</h4>
                  <p className='text-sm text-muted-foreground'>
                    São Paulo, Brasil
                  </p>
                  <p className='text-xs text-green-600 mt-1'>Sessão atual</p>
                </div>
                <Button variant='ghost' size='sm'>
                  Encerrar
                </Button>
              </div>
            </div>

            <div className='border rounded-lg p-4 dark:border-gray-700'>
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='font-medium'>Safari em iPhone</h4>
                  <p className='text-sm text-muted-foreground'>
                    São Paulo, Brasil
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Último acesso: 2 horas atrás
                  </p>
                </div>
                <Button variant='ghost' size='sm'>
                  Encerrar
                </Button>
              </div>
            </div>

            <div className='border rounded-lg p-4 dark:border-gray-700'>
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='font-medium'>Firefox em MacBook</h4>
                  <p className='text-sm text-muted-foreground'>
                    Rio de Janeiro, Brasil
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Último acesso: ontem
                  </p>
                </div>
                <Button variant='ghost' size='sm'>
                  Encerrar
                </Button>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Encerrar todas as outras sessões
          </Button>
        </div>

        <div className='flex justify-end space-x-4 pt-4'>
          <Button type='button' variant='outline'>
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </form>
  )
}


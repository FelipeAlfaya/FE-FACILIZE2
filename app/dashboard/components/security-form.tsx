'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Check } from 'lucide-react'

export function SecurityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
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
              <Label htmlFor='current-password'>Senha Atual</Label>
              <Input id='current-password' type='password' />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='new-password'>Nova Senha</Label>
              <Input id='new-password' type='password' />
              <p className='text-xs text-muted-foreground mt-1'>
                A senha deve ter pelo menos 8 caracteres e incluir letras
                maiúsculas, minúsculas, números e símbolos.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm-password'>Confirmar Nova Senha</Label>
              <Input id='confirm-password' type='password' />
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

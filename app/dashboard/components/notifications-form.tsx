'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Check } from 'lucide-react'

export function NotificationsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-xl font-bold mb-6'>Preferências de Notificações</h2>

      {showSuccess && (
        <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-6 flex items-center'>
          <Check className='h-5 w-5 mr-2' />
          Configurações salvas com sucesso!
        </div>
      )}

      <div className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Notificações por Email</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Escolha quais emails você deseja receber.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='email_appointments' className='font-medium'>
                  Agendamentos
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba emails sobre novos agendamentos, confirmações e
                  lembretes.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='email_appointments'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='email_payments' className='font-medium'>
                  Pagamentos
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba emails sobre pagamentos, faturas e recibos.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='email_payments'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='email_system' className='font-medium'>
                  Sistema
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba emails sobre atualizações do sistema e manutenções.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='email_system'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>
              Notificações no Aplicativo
            </h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Escolha quais notificações você deseja receber no aplicativo.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='app_appointments' className='font-medium'>
                  Agendamentos
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba notificações sobre novos agendamentos e lembretes.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='app_appointments'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='app_messages' className='font-medium'>
                  Mensagens
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba notificações sobre novas mensagens e comentários.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='app_messages'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='app_payments' className='font-medium'>
                  Pagamentos
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba notificações sobre pagamentos e faturas.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='app_payments'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
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

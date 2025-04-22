'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'

export function AccountForm() {
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
      <h2 className='text-xl font-bold mb-6'>Configurações da Conta</h2>

      {showSuccess && (
        <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-6 flex items-center'>
          <Check className='h-5 w-5 mr-2' />
          Configurações salvas com sucesso!
        </div>
      )}

      <div className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Informações Pessoais</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Atualize suas informações pessoais e de contato.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nome Completo</Label>
              <Input id='name' defaultValue='Felipe da Silva' />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                defaultValue='felipe.silva@email.com'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Telefone</Label>
              <Input id='phone' defaultValue='(11) 98765-4321' />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='language'>Idioma</Label>
              <select
                id='language'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value='pt-BR'>Português (Brasil)</option>
                <option value='en-US'>English (US)</option>
                <option value='es'>Español</option>
              </select>
            </div>
          </div>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Biografia</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Conte um pouco sobre você e seus serviços.
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio'>Biografia</Label>
            <Textarea
              id='bio'
              rows={4}
              defaultValue='Contador com mais de 10 anos de experiência em contabilidade fiscal e tributária para pequenas e médias empresas.'
            />
          </div>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Preferências de Conta</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Personalize suas preferências de conta e comunicação.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='marketing' className='font-medium'>
                  Emails de Marketing
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba novidades, dicas e ofertas especiais.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='marketing'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='newsletter' className='font-medium'>
                  Newsletter Semanal
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba um resumo semanal com novidades e conteúdos relevantes.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='sr-only peer'
                  id='newsletter'
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

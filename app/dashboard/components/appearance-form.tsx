'use client'

import type React from 'react'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

export function AppearanceForm() {
  const { theme, setTheme } = useTheme()
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
      <h2 className='text-xl font-bold mb-6'>Aparência</h2>

      {showSuccess && (
        <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-6 flex items-center'>
          <Check className='h-5 w-5 mr-2' />
          Configurações salvas com sucesso!
        </div>
      )}

      <div className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Tema</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Selecione o tema de sua preferência para a interface do Facilize.
            </p>
          </div>

          <RadioGroup
            defaultValue={theme}
            value={theme}
            onValueChange={setTheme}
            className='grid grid-cols-1 md:grid-cols-3 gap-4'
          >
            <div>
              <RadioGroupItem
                value='light'
                id='light'
                className='peer sr-only'
                aria-label='Tema Claro'
              />
              <Label
                htmlFor='light'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer'
              >
                <Sun className='h-6 w-6 mb-3 text-gray-700' />
                <div className='font-medium'>Claro</div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='dark'
                id='dark'
                className='peer sr-only'
                aria-label='Tema Escuro'
              />
              <Label
                htmlFor='dark'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:border-gray-700 dark:peer-data-[state=checked]:bg-blue-950 dark:[&:has([data-state=checked])]:bg-blue-950'
              >
                <Moon className='h-6 w-6 mb-3 text-gray-700 dark:text-gray-300' />
                <div className='font-medium'>Escuro</div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='system'
                id='system'
                className='peer sr-only'
                aria-label='Tema do Sistema'
              />
              <Label
                htmlFor='system'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:border-gray-700 dark:peer-data-[state=checked]:bg-blue-950 dark:[&:has([data-state=checked])]:bg-blue-950'
              >
                <Monitor className='h-6 w-6 mb-3 text-gray-700 dark:text-gray-300' />
                <div className='font-medium'>Sistema</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Densidade</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Ajuste o espaçamento e densidade dos elementos na interface.
            </p>
          </div>

          <RadioGroup
            defaultValue='default'
            className='grid grid-cols-1 md:grid-cols-3 gap-4'
          >
            <div>
              <RadioGroupItem
                value='compact'
                id='compact'
                className='peer sr-only'
                aria-label='Compacto'
              />
              <Label
                htmlFor='compact'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:border-gray-700 dark:peer-data-[state=checked]:bg-blue-950 dark:[&:has([data-state=checked])]:bg-blue-950'
              >
                <div className='font-medium'>Compacto</div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='default'
                id='default'
                className='peer sr-only'
                aria-label='Padrão'
              />
              <Label
                htmlFor='default'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:border-gray-700 dark:peer-data-[state=checked]:bg-blue-950 dark:[&:has([data-state=checked])]:bg-blue-950'
              >
                <div className='font-medium'>Padrão</div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='comfortable'
                id='comfortable'
                className='peer sr-only'
                aria-label='Confortável'
              />
              <Label
                htmlFor='comfortable'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:border-gray-700 dark:peer-data-[state=checked]:bg-blue-950 dark:[&:has([data-state=checked])]:bg-blue-950'
              >
                <div className='font-medium'>Confortável</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Cor de Destaque</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Escolha a cor principal para botões e elementos de destaque.
            </p>
          </div>

          <RadioGroup
            defaultValue='blue'
            className='grid grid-cols-3 md:grid-cols-6 gap-4'
          >
            <div>
              <RadioGroupItem
                value='blue'
                id='blue'
                className='peer sr-only'
                aria-label='Azul'
              />
              <Label
                htmlFor='blue'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer'
              >
                <div className='w-full h-10 rounded bg-blue-600'></div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='green'
                id='green'
                className='peer sr-only'
                aria-label='Verde'
              />
              <Label
                htmlFor='green'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:border-green-600 [&:has([data-state=checked])]:border-green-600 cursor-pointer'
              >
                <div className='w-full h-10 rounded bg-green-600'></div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='purple'
                id='purple'
                className='peer sr-only'
                aria-label='Roxo'
              />
              <Label
                htmlFor='purple'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600 cursor-pointer'
              >
                <div className='w-full h-10 rounded bg-purple-600'></div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='orange'
                id='orange'
                className='peer sr-only'
                aria-label='Laranja'
              />
              <Label
                htmlFor='orange'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:border-orange-600 [&:has([data-state=checked])]:border-orange-600 cursor-pointer'
              >
                <div className='w-full h-10 rounded bg-orange-600'></div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='red'
                id='red'
                className='peer sr-only'
                aria-label='Vermelho'
              />
              <Label
                htmlFor='red'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:border-red-600 [&:has([data-state=checked])]:border-red-600 cursor-pointer'
              >
                <div className='w-full h-10 rounded bg-red-600'></div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='gray'
                id='gray'
                className='peer sr-only'
                aria-label='Cinza'
              />
              <Label
                htmlFor='gray'
                className='flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:border-gray-600 [&:has([data-state=checked])]:border-gray-600 cursor-pointer'
              >
                <div className='w-full h-10 rounded bg-gray-600'></div>
              </Label>
            </div>
          </RadioGroup>
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

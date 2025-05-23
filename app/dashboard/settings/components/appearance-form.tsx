'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

// Tipos e cores para cada tema
const themeConfigs = [
  {
    value: 'light',
    label: 'Claro',
    icon: Sun,
    colors: {
      background: 'bg-white',
      foreground: 'text-slate-950',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50 hover:border-gray-300',
      active:
        'peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50',
    },
  },
  {
    value: 'dark',
    label: 'Escuro',
    icon: Moon,
    colors: {
      background: 'bg-gray-950',
      foreground: 'text-gray-300',
      border: 'border-gray-800',
      hover: 'hover:bg-gray-900 hover:border-gray-700',
      active:
        'dark:peer-data-[state=checked]:bg-blue-950 dark:[&:has([data-state=checked])]:bg-blue-950 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600',
    },
  },
  {
    value: 'nord',
    label: 'Nord',
    icon: null,
    iconColor: 'bg-[#88C0D0]',
    colors: {
      background: 'bg-[#2E3440]', // Nord dark background
      foreground: 'text-[#D8DEE9]', // Nord light text
      border: 'border-[#3B4252]', // Nord border
      hover: 'hover:bg-[#3B4252] hover:border-[#4C566A]',
      active:
        'peer-data-[state=checked]:border-[#88C0D0] [&:has([data-state=checked])]:border-[#88C0D0]',
    },
  },
  {
    value: 'monokai',
    label: 'Monokai',
    icon: null,
    iconColor: 'bg-[#f92672]',
    colors: {
      background: 'bg-[#272822]', // Monokai background
      foreground: 'text-[#f8f8f2]', // Monokai text
      border: 'border-[#3E3D32]', // Monokai border
      hover: 'hover:bg-[#3E3D32] hover:border-[#75715E]',
      active:
        'peer-data-[state=checked]:border-[#f92672] [&:has([data-state=checked])]:border-[#f92672]',
    },
  },
  {
    value: 'onedark',
    label: 'One Dark',
    icon: null,
    iconColor: 'bg-[#61afef]',
    colors: {
      background: 'bg-[#282c34]', // One Dark background
      foreground: 'text-[#abb2bf]', // One Dark text
      border: 'border-[#3b4048]', // One Dark border
      hover: 'hover:bg-[#3b4048] hover:border-[#4b5263]',
      active:
        'peer-data-[state=checked]:border-[#61afef] [&:has([data-state=checked])]:border-[#61afef]',
    },
  },
  {
    value: 'system',
    label: 'Sistema',
    icon: Monitor,
    colors: {
      background: 'bg-white dark:bg-gray-950',
      foreground: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
      hover:
        'hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-900 dark:hover:border-gray-700',
      active:
        'peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 [&:has([data-state=checked])]:border-blue-600 dark:[&:has([data-state=checked])]:bg-blue-950',
    },
  },
  {
    value: 'dracula',
    label: 'Dracula',
    icon: null,
    iconColor: 'bg-[#BD93F9]',
    colors: {
      background: 'bg-[#282A36]',
      foreground: 'text-[#F8F8F2]',
      border: 'border-[#44475A]',
      hover: 'hover:bg-[#44475A] hover:border-[#6272A4]',
      active:
        'peer-data-[state=checked]:border-[#BD93F9] [&:has([data-state=checked])]:border-[#BD93F9]',
    },
  },
  {
    value: 'solarized',
    label: 'Solarized',
    icon: null,
    iconColor: 'bg-[#268BD2]',
    colors: {
      background: 'bg-[#FDF6E3]',
      foreground: 'text-[#657B83]',
      border: 'border-[#EEE8D5]',
      hover: 'hover:bg-[#EEE8D5] hover:border-[#D3CBB8]',
      active:
        'peer-data-[state=checked]:border-[#268BD2] [&:has([data-state=checked])]:border-[#268BD2]',
    },
  },
  {
    value: 'dimmed',
    label: 'Dimmed',
    icon: null,
    iconColor: 'bg-[#586069]',
    colors: {
      background: 'bg-[#1C1F24]',
      foreground: 'text-[#E1E4E8]',
      border: 'border-[#2F363D]',
      hover: 'hover:bg-[#2F363D] hover:border-[#444C56]',
      active:
        'peer-data-[state=checked]:border-[#586069] [&:has([data-state=checked])]:border-[#586069]',
    },
  },
]

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
      setTimeout(() => setShowSuccess(false), 3000)
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
            value={theme}
            onValueChange={setTheme}
            className='grid grid-cols-1 md:grid-cols-3 gap-4'
          >
            {themeConfigs.map((config) => (
              <div key={config.value}>
                <RadioGroupItem
                  value={config.value}
                  id={config.value}
                  className='peer sr-only'
                  aria-label={`Tema ${config.label}`}
                />
                <Label
                  htmlFor={config.value}
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-colors
                    ${config.colors.background} 
                    ${config.colors.foreground} 
                    ${config.colors.border} 
                    ${config.colors.hover} 
                    ${config.colors.active}`}
                >
                  {config.icon ? (
                    <config.icon className='h-6 w-6 mb-3' />
                  ) : (
                    <div
                      className={`w-6 h-6 mb-3 rounded-full ${config.iconColor}`}
                    />
                  )}
                  <div className='font-medium'>{config.label}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Restante do formulário permanece igual */}
        <Separator />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Densidade</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Funcionalidade em desenvolvimento. Em breve disponível.
            </p>
          </div>
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
            {[
              {
                value: 'blue',
                color: 'bg-blue-600',
                border: 'border-blue-600',
              },
              {
                value: 'green',
                color: 'bg-green-600',
                border: 'border-green-600',
              },
              {
                value: 'purple',
                color: 'bg-purple-600',
                border: 'border-purple-600',
              },
              {
                value: 'orange',
                color: 'bg-orange-600',
                border: 'border-orange-600',
              },
              { value: 'red', color: 'bg-red-600', border: 'border-red-600' },
              {
                value: 'gray',
                color: 'bg-gray-600',
                border: 'border-gray-600',
              },
            ].map((color) => (
              <div key={color.value}>
                <RadioGroupItem
                  value={color.value}
                  id={color.value}
                  className='peer sr-only'
                  aria-label={`Cor ${color.value}`}
                />
                <Label
                  htmlFor={color.value}
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-1 hover:border-gray-300 peer-data-[state=checked]:${color.border} [&:has([data-state=checked])]:${color.border} cursor-pointer`}
                >
                  <div className={`w-full h-10 rounded ${color.color}`}></div>
                </Label>
              </div>
            ))}
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


'use client'

import type React from 'react'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AnimatedInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  required?: boolean
  placeholder?: string
  maxLength?: number
  icon?: React.ReactNode
}

export default function AnimatedInput({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
  placeholder = '',
  maxLength,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className='relative space-y-1'>
      <Label
        htmlFor={name}
        className={cn(
          'absolute left-3 transition-all duration-200',
          isFocused || value
            ? '-top-2.5 text-xs bg-white dark:bg-black px-1 z-10 rounded-xs'
            : 'top-2.5',
          error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
        )}
      >
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn('pt-2', error ? 'border-red-500 focus:ring-red-500' : '')}
        placeholder={isFocused ? placeholder : ''}
        maxLength={maxLength}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  )
}

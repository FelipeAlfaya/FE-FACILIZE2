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
            ? '-top-2.5 text-xs bg-background px-1 z-10 rounded-xs'
            : 'top-2.5',
          error ? 'text-destructive' : 'text-muted-foreground'
        )}
      >
        {label}
        {required && <span className='text-destructive ml-1'>*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'pt-2 bg-background',
          error ? 'border-destructive focus:ring-destructive' : ''
        )}
        placeholder={isFocused ? placeholder : ''}
        maxLength={maxLength}
      />
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  )
}

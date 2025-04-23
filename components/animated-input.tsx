'use client'

import { useState, type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, className, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value !== '')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value !== '')
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <div className='relative'>
        <div
          className={cn(
            'group relative rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800',
            isFocused &&
              'ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400',
            error &&
              'border-red-500 ring-red-500 dark:border-red-500 dark:ring-red-500',
            className
          )}
        >
          <label
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out pointer-events-none text-gray-500 dark:text-gray-400',
              (isFocused || hasValue) &&
                'transform -translate-y-[1.85rem] scale-75 text-sm px-1 bg-white dark:bg-gray-800 z-10',
              isFocused && !error && 'text-blue-500 dark:text-blue-400',
              error && 'text-red-500 dark:text-red-400'
            )}
          >
            {label}
          </label>
          <input
            {...props}
            ref={ref}
            className='w-full px-3 py-3 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        {error && (
          <p className='mt-1 text-xs text-red-500 dark:text-red-400'>{error}</p>
        )}
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'

export default AnimatedInput

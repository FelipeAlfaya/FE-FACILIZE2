"use client"

import type React from "react"

import { useState, type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(({ label, className, error, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setHasValue(e.target.value !== "")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value !== "")
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "group relative rounded-md border border-input transition-all duration-300 ease-in-out",
          isFocused && "ring-2 ring-blue-500 border-blue-500",
          error && "border-red-500 ring-red-500",
          className,
        )}
      >
        <label
          className={cn(
            "absolute left-3 transition-all duration-200 ease-in-out pointer-events-none text-gray-500",
            (isFocused || hasValue) && "transform -translate-y-[1.15rem] scale-75 text-xs px-1 bg-white z-10",
            isFocused && !error && "text-blue-500",
            error && "text-red-500",
          )}
        >
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          className="w-full px-3 py-2 bg-transparent border-none focus:outline-none text-foreground"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})

AnimatedInput.displayName = "AnimatedInput"

export default AnimatedInput

'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InteractiveStarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export function InteractiveStarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  disabled = false,
  className,
}: InteractiveStarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (starRating: number) => {
    if (!disabled) {
      onRatingChange(starRating)
    }
  }

  const handleStarHover = (starRating: number) => {
    if (!disabled) {
      setHoverRating(starRating)
    }
  }

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0)
    }
  }

  return (
    <div
      className={cn('flex gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starRating = index + 1
        const isActive = starRating <= (hoverRating || rating)

        return (
          <button
            key={index}
            type='button'
            className={cn(
              'transition-all duration-200 hover:scale-110',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            disabled={disabled}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                isActive
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

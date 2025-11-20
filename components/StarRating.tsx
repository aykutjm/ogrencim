'use client'

import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ 
  value, 
  onChange, 
  readonly = false,
  size = 'md' 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  const displayValue = hoverValue ?? value

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          className={`${sizeClasses[size]} transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <FaStar
            className={
              star <= displayValue
                ? 'text-yellow-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {displayValue}/5
        </span>
      )}
    </div>
  )
}

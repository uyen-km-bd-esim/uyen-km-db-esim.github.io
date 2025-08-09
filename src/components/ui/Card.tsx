'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card-esimphony',
          variant === 'outline' && 'border-2 border-gray-200 shadow-none',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }
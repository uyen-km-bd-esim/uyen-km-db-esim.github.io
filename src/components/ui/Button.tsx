'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'topup' | 'disabled'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-esim transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-esimphony-black'
    
    const variants = {
      primary: 'btn-esimphony-primary',
      secondary: 'btn-esimphony-secondary',
      topup: 'bg-transparent border-2 border-esimphony-red text-esimphony-red hover:bg-esimphony-red hover:text-esimphony-white focus:ring-esimphony-red/50',
      disabled: 'bg-transparent border-2 border-esimphony-light-gray text-esimphony-white opacity-80 cursor-not-allowed'
    }
    
    const sizes = {
      sm: 'py-2 px-4 text-sm min-h-[36px]',
      md: 'py-3 px-6 text-base min-h-[44px]',
      lg: 'py-4 px-8 text-lg min-h-[56px]'
    }
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
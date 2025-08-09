'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { User } from '@/types'
import { storage } from '@/lib/utils'

interface AutoRenewSectionProps {
  user: User
  onUserUpdate: (updatedUser: User) => void
}

export function AutoRenewSection({ user, onUserUpdate }: AutoRenewSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showAmountSelector, setShowAmountSelector] = useState(false)

  const isAutoRenewEnabled = user.autoRenewal?.enabled || false
  const hasActiveSubscription = user.activePlan?.type === 'subscription'
  
  const handleToggleAutoRenew = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = {
        ...user,
        autoRenewal: {
          ...user.autoRenewal,
          enabled: !isAutoRenewEnabled,
          renewalDate: !isAutoRenewEnabled ? getNextRenewalDate() : undefined,
          renewalAmount: !isAutoRenewEnabled ? getRecommendedAmount() : undefined
        }
      }
      
      // Update localStorage
      storage.set('userProfile', updatedUser)
      onUserUpdate(updatedUser)
      
      setIsLoading(false)
      
      if (!isAutoRenewEnabled) {
        setShowAmountSelector(!hasActiveSubscription)
      }
    } catch (error) {
      console.error('Auto-renew toggle failed:', error)
      setIsLoading(false)
    }
  }

  const handleAmountSelect = (amount: number) => {
    const updatedUser = {
      ...user,
      autoRenewal: {
        ...user.autoRenewal,
        enabled: true,
        preferredTopUpAmount: amount,
        renewalDate: getNextTopUpDate()
      }
    }
    
    storage.set('userProfile', updatedUser)
    onUserUpdate(updatedUser)
    setShowAmountSelector(false)
  }

  const getNextRenewalDate = () => {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth.toLocaleDateString()
  }

  const getNextTopUpDate = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek.toLocaleDateString()
  }

  const getRecommendedAmount = () => {
    if (hasActiveSubscription && user.activePlan) {
      return user.activePlan.price
    }
    return 25 // Default recommended amount
  }

  const topUpAmounts = [10, 25, 50, 100]

  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
              <i className="fas fa-sync-alt text-esimphony-red mr-2"></i>
              Auto-Renew
            </h2>
            <p className="text-esimphony-gray text-sm mt-1">
              {hasActiveSubscription 
                ? 'Automatically renew your subscription' 
                : 'Automatically top-up your balance'}
            </p>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={handleToggleAutoRenew}
            disabled={isLoading}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAutoRenewEnabled 
                ? 'bg-esimphony-red' 
                : 'bg-esimphony-gray'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-esimphony-white rounded-full transition-transform ${
                isAutoRenewEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 border border-esimphony-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </div>

        {/* Auto-Renew Details */}
        {isAutoRenewEnabled && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {hasActiveSubscription ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-esimphony-gray text-sm">Next renewal:</span>
                  <span className="font-semibold text-esimphony-black">
                    {user.autoRenewal?.renewalDate || getNextRenewalDate()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-esimphony-gray text-sm">Renewal cost:</span>
                  <span className="font-semibold text-esimphony-black">
                    ${user.autoRenewal?.renewalAmount || user.activePlan?.price || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-esimphony-gray">Plan:</span>
                  <span className="text-esimphony-black">{user.activePlan?.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-esimphony-gray text-sm">Next top-up:</span>
                  <span className="font-semibold text-esimphony-black">
                    {user.autoRenewal?.renewalDate || getNextTopUpDate()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-esimphony-gray text-sm">Top-up amount:</span>
                  <span className="font-semibold text-esimphony-black">
                    ${user.autoRenewal?.preferredTopUpAmount || 25}
                  </span>
                </div>
              </>
            )}
            
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-esimphony-gray">
                <i className="fas fa-info-circle mr-1"></i>
                {hasActiveSubscription 
                  ? 'Your plan will be automatically renewed before it expires'
                  : 'Your balance will be topped up when it falls below $10'}
              </p>
            </div>
          </div>
        )}

        {/* Amount Selector for non-subscription users */}
        {showAmountSelector && !hasActiveSubscription && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-esimphony-black mb-3">
              Select preferred top-up amount:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {topUpAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAmountSelect(amount)}
                  className="text-center hover:bg-blue-100 border-blue-300"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAmountSelector(false)}
              className="w-full mt-2 text-esimphony-gray"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Call to action for users without auto-renew */}
        {!isAutoRenewEnabled && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-lightbulb mr-1"></i>
              Enable auto-renew to never worry about running out of {hasActiveSubscription ? 'data' : 'balance'} again
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { User } from '@/types'

export function TopUpPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const router = useRouter()

  const predefinedAmounts = [10, 25, 50, 100]

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }
    
    setUser(userProfile)
    setIsLoading(false)
  }, [router])

  const getTopUpAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleTopUp = async () => {
    if (!user) return
    
    const amount = getTopUpAmount()
    if (amount <= 0) return

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Update user balance
    const updatedUser = {
      ...user,
      balance: user.balance + amount
    }
    
    setUser(updatedUser)
    storage.set('userProfile', updatedUser)
    setIsProcessing(false)
    setPaymentComplete(true)
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
      const topUpSource = storage.get('topUpSource')
      storage.remove('topUpSource')
      
      if (topUpSource === 'tariff-details-balance') {
        router.push('/plans')
      } else {
        router.push('/dashboard')
      }
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="container-esimphony flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
      </div>
    )
  }

  if (!user) return null

  if (paymentComplete) {
    return (
      <div className="container-esimphony flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-esimphony-black mb-4">
              Payment Successful!
            </h1>
            <p className="text-esimphony-gray mb-2">
              ${getTopUpAmount().toFixed(2)} has been added to your account
            </p>
            <p className="text-lg font-semibold text-esimphony-black mb-6">
              New Balance: ${user.balance.toFixed(2)}
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-esimphony-red mx-auto" />
            <p className="text-esimphony-gray text-sm mt-4">
              Redirecting you back...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <AppLayout showBottomNav={false}>
      <div className="container-esimphony pt-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="text-esimphony-white hover:text-esimphony-red mr-4">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-esimphony-white">
              Top-Up Balance
            </h1>
            <p className="text-esimphony-gray text-sm">
              Current Balance: <span className="font-semibold">${user.balance.toFixed(2)}</span>
            </p>
          </div>
        </div>

      {/* Amount Selection */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Select Amount
          </h2>
          
          {/* Predefined Amounts */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-esim border-2 transition-all ${
                  selectedAmount === amount
                    ? 'border-esimphony-red bg-red-50 text-esimphony-red'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl font-bold">${amount}</div>
                <div className="text-xs text-esimphony-gray">Quick add</div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm font-medium text-esimphony-gray mb-2">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-esimphony-gray">
                $
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8"
                min="1"
                max="500"
                step="0.01"
              />
            </div>
            <p className="text-xs text-esimphony-gray mt-1">
              Minimum: $1.00 • Maximum: $500.00
            </p>
          </div>
        </div>
      </Card>

      {/* New Balance Preview */}
      {getTopUpAmount() > 0 && (
        <Card className="mb-6 border-2 border-esimphony-success">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-esimphony-black mb-2">
              New Balance Preview
            </h3>
            <div className="text-3xl font-bold text-esimphony-black mb-2">
              ${(user.balance + getTopUpAmount()).toFixed(2)}
            </div>
            <div className="text-sm text-esimphony-gray">
              Current: ${user.balance.toFixed(2)} + Top-up: ${getTopUpAmount().toFixed(2)}
            </div>
          </div>
        </Card>
      )}

      {/* Payment Method */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Payment Method
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center p-4 border-2 border-esimphony-red bg-red-50 rounded-esim">
              <i className="fab fa-stripe text-esimphony-red text-2xl mr-4"></i>
              <div>
                <h3 className="font-semibold text-esimphony-black">Stripe Payment</h3>
                <p className="text-sm text-esimphony-gray">
                  Secure payment processing • Cards, Apple Pay, Google Pay
                </p>
              </div>
              <i className="fas fa-check-circle text-esimphony-red ml-auto"></i>
            </div>

            <div className="flex items-center p-4 border border-gray-300 rounded-esim opacity-50">
              <i className="fas fa-credit-card text-esimphony-gray text-2xl mr-4"></i>
              <div>
                <h3 className="font-semibold text-esimphony-gray">Direct Card</h3>
                <p className="text-sm text-esimphony-gray">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center mb-3">
            <i className="fas fa-shield-alt text-esimphony-success text-xl mr-3"></i>
            <h3 className="font-semibold text-esimphony-black">Secure Payment</h3>
          </div>
          <ul className="text-sm text-esimphony-gray space-y-1">
            <li>• 256-bit SSL encryption</li>
            <li>• PCI DSS compliant processing</li>
            <li>• No card details stored</li>
            <li>• Instant balance update</li>
          </ul>
        </div>
      </Card>

      {/* Payment Button */}
      <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
        <Button
          variant={getTopUpAmount() > 0 ? "primary" : "disabled"}
          onClick={handleTopUp}
          disabled={getTopUpAmount() <= 0 || isProcessing}
          isLoading={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            'Processing Payment...'
          ) : getTopUpAmount() > 0 ? (
            <>
              <i className="fas fa-credit-card mr-2"></i>
              Pay ${getTopUpAmount().toFixed(2)}
            </>
          ) : (
            'Select Amount'
          )}
        </Button>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
      </div>
    </AppLayout>
  )
}
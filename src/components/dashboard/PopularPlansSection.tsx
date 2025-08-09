'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { User } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'

interface PopularPlan {
  id: string
  data: string
  price: string
  duration: string
  country: string
  flag: string
  type: 'prepaid' | 'subscription' | 'payg'
  popular?: boolean
}

interface PopularPlansSectionProps {
  user: User
  hasActivePlan: boolean
  onUserUpdate?: (user: User) => void
}

export function PopularPlansSection({ user, hasActivePlan, onUserUpdate }: PopularPlansSectionProps) {
  const router = useRouter()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showSuccessView, setShowSuccessView] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<PopularPlan | null>(null)

  // Sample popular plans from different regions/types
  const popularPlans: PopularPlan[] = [
    {
      id: 'us-popular',
      data: '10GB',
      price: '$15.00',
      duration: '30 days',
      country: 'United States',
      flag: '🇺🇸',
      type: 'prepaid',
      popular: true
    },
    {
      id: 'eu-popular',
      data: '20GB',
      price: '$25.00',
      duration: '30 days',
      country: 'Europe',
      flag: '🇪🇺',
      type: 'prepaid',
      popular: true
    },
    {
      id: 'asia-popular',
      data: '15GB',
      price: '$20.00',
      duration: '21 days',
      country: 'Asia Pacific',
      flag: '🌏',
      type: 'prepaid'
    },
    {
      id: 'payg-popular',
      data: '5GB',
      price: '$12.00',
      duration: 'Pay as you go',
      country: 'Global',
      flag: '🌍',
      type: 'payg'
    }
  ]

  const handlePlanSelect = (plan: PopularPlan) => {
    const planPrice = parseFloat(plan.price.replace('$', ''))

    if (user.balance < planPrice) {
      // Store plan for top-up flow
      storage.set('planChangeData', plan)
      storage.set('topUpSource', 'home-dashboard')
      router.push('/top-up')
    } else {
      // Show confirmation modal instead of navigating
      setPendingPlan(plan)
      setShowConfirmationModal(true)
    }
  }

  const handleConfirmOrder = () => {
    if (!user || !pendingPlan) return
    
    const planPrice = parseFloat(pendingPlan.price.replace('$', ''))
    
    // Create active plan from purchased plan
    const activePlan = {
      id: pendingPlan.id,
      name: `${pendingPlan.data} ${pendingPlan.type} Plan`,
      region: pendingPlan.country,
      dataUsed: 0,
      dataTotal: parseInt(pendingPlan.data.replace(/[^\d]/g, '')), // Extract number from "10GB"
      daysLeft: pendingPlan.duration?.includes('7') ? 7 : pendingPlan.duration?.includes('30') ? 30 : 30,
      status: 'active',
      type: pendingPlan.type,
      price: pendingPlan.price,
      duration: pendingPlan.duration,
      autoRenew: false
    }
    
    // Update user with new balance and active plan
    const updatedUser = { 
      ...user, 
      balance: user.balance - planPrice,
      activePlan
    }
    
    // Update local state and storage
    if (onUserUpdate) {
      onUserUpdate(updatedUser)
    }
    storage.set('userProfile', updatedUser)
    
    // Close confirmation modal and show success view
    setShowConfirmationModal(false)
    setShowSuccessView(true)
  }

  const handleCancelOrder = () => {
    setShowConfirmationModal(false)
    setPendingPlan(null)
  }

  const handleSuccessClose = () => {
    setShowSuccessView(false)
    setPendingPlan(null)
  }

  const handleBrowsePlans = () => {
    if (hasActivePlan) {
      // If user has active plan, navigate to plans page with update view
      storage.set('showUpdatePlanView', true)
    } else {
      // If no active plan, clear any existing navigation state
      storage.remove('showUpdatePlanView')
    }
    router.push('/plans')
  }


  const sectionTitle = hasActivePlan ? 'Upgrade Your Plan' : 'Choose Your First Plan'
  const sectionSubtitle = hasActivePlan 
    ? 'Switch to a different plan or region'
    : 'Get connected with our popular eSIM plans'


  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
            <i className="fas fa-star text-esimphony-red mr-2"></i>
            {sectionTitle}
          </h2>
          <p className="text-esimphony-gray text-sm mt-1">
            {sectionSubtitle}
          </p>
        </div>

        {/* Popular Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {popularPlans.slice(0, 4).map((plan) => {
            const planPrice = parseFloat(plan.price.replace('$', ''))
            const canAfford = user.balance >= planPrice
            const isCurrentPlan = hasActivePlan && user.activePlan?.country === plan.country

            return (
              <div
                key={plan.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  plan.popular 
                    ? 'border-esimphony-red bg-red-50' 
                    : 'border-gray-200 hover:border-esimphony-red'
                } ${isCurrentPlan ? 'opacity-50' : ''}`}
                onClick={() => !isCurrentPlan && handlePlanSelect(plan)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-2 left-4 bg-esimphony-red text-esimphony-white text-xs px-2 py-1 rounded-full font-semibold">
                    POPULAR
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-2 right-4 bg-esimphony-success text-esimphony-white text-xs px-2 py-1 rounded-full font-semibold">
                    CURRENT
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{plan.flag}</span>
                    <span className="font-semibold text-esimphony-black text-sm">
                      {plan.country}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-esimphony-red">
                      {plan.price}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-esimphony-gray text-sm">Data:</span>
                    <span className="font-semibold text-esimphony-black text-sm">
                      {plan.data}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-esimphony-gray text-sm">Duration:</span>
                    <span className="font-semibold text-esimphony-black text-sm">
                      {plan.duration}
                    </span>
                  </div>
                </div>

                {/* Plan Type Badge */}
                <div className="mt-3 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    plan.type === 'prepaid' ? 'bg-blue-100 text-blue-800' :
                    plan.type === 'subscription' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {plan.type.toUpperCase()}
                  </span>

                  {/* Affordability Indicator */}
                  {!isCurrentPlan && (
                    <div className="flex items-center">
                      {canAfford ? (
                        <i className="fas fa-check-circle text-esimphony-success text-sm"></i>
                      ) : (
                        <i className="fas fa-exclamation-triangle text-esimphony-warning text-sm" 
                           title="Insufficient balance - will redirect to top-up"></i>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Plan Type Legend */}
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-wrap gap-4 text-xs text-esimphony-gray">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
              <span>Prepaid - Fixed data for specific duration</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
              <span>PAYG - Pay only for what you use</span>
            </div>
          </div>
        </div>

        {/* Browse All Plans CTA */}
        <div className="mt-4 text-center">
          <Button 
            variant="primary" 
            className="w-full sm:w-auto"
            onClick={handleBrowsePlans}
          >
            <i className="fas fa-search mr-2"></i>
            Browse Plans
          </Button>
        </div>
      </div>
      
      {/* Confirmation and Success Modals for Dashboard */}
      {showConfirmationModal && pendingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-esimphony-white rounded-lg max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <i className="fas fa-credit-card text-esimphony-red text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-esimphony-black mb-2">
                Confirm Your Order
              </h3>
              <p className="text-esimphony-gray text-sm">
                You're about to purchase the following plan:
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-esimphony-black">{pendingPlan.data}</span>
                <span className="text-esimphony-red font-bold">{pendingPlan.price}</span>
              </div>
              <div className="text-sm text-esimphony-gray mb-1">{pendingPlan.duration}</div>
              <div className="text-sm text-esimphony-gray">
                {pendingPlan.country}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-esimphony-black rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-3 bg-esimphony-red hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessView && pendingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-esimphony-white rounded-lg max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-esimphony-black mb-2">
                Order Successful!
              </h3>
              <p className="text-esimphony-gray text-sm">
                Your plan has been activated successfully
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-esimphony-black">{pendingPlan.data}</span>
                <span className="text-green-600 font-bold">{pendingPlan.price}</span>
              </div>
              <div className="text-sm text-esimphony-gray mb-1">{pendingPlan.duration}</div>
              <div className="text-sm text-esimphony-gray">
                {pendingPlan.country}
              </div>
              <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                <i className="fas fa-check-circle mr-1"></i>
                Plan activated and ready to use
              </div>
            </div>

            <button
              onClick={handleSuccessClose}
              className="w-full py-3 bg-esimphony-red hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
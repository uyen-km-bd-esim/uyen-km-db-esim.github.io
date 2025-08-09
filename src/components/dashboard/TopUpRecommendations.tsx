'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PaymentModal } from '@/components/ui/PaymentModal'
import { User } from '@/types'

interface TopUpRecommendationsProps {
  user: User
  onUserUpdate: (user: User) => void
}

interface RecommendedAmount {
  amount: number
  label: string
  description: string
  savings?: string
  popular?: boolean
}

export function TopUpRecommendations({ user, onUserUpdate }: TopUpRecommendationsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Only show for users with active plans (Prepaid or Subscription)
  if (!user.activePlan) return null

  const isSubscription = user.activePlan.type === 'subscription'
  const isPrepaid = user.activePlan.type === 'prepaid'
  
  // Only show for Prepaid and Subscription users
  if (!isSubscription && !isPrepaid) return null

  const getRecommendedAmounts = (): RecommendedAmount[] => {
    if (isSubscription) {
      const planPrice = user.activePlan?.price || 35
      return [
        {
          amount: planPrice,
          label: 'Next Billing',
          description: `Cover your next ${user.activePlan?.name} renewal`,
          popular: true
        },
        {
          amount: planPrice * 2,
          label: '2 Months',
          description: 'Cover next 2 billing cycles',
          savings: 'Skip monthly top-ups'
        },
        {
          amount: planPrice * 3,
          label: '3 Months',
          description: 'Quarterly prepayment',
          savings: '5% bonus credit'
        }
      ]
    } else {
      // Prepaid recommendations
      return [
        {
          amount: 25,
          label: 'Standard',
          description: 'Good for 1-2 additional plans',
          popular: true
        },
        {
          amount: 50,
          label: 'Value Pack',
          description: 'Cover multiple trips',
          savings: '2% bonus credit'
        },
        {
          amount: 100,
          label: 'Premium',
          description: 'Extended travel coverage',
          savings: '5% bonus credit'
        }
      ]
    }
  }

  const handleRecommendationSelect = (amount: number) => {
    setSelectedRecommendation(amount)
  }

  const handleTopUpNow = () => {
    if (selectedRecommendation) {
      setShowPaymentModal(true)
    }
  }

  const getDaysUntilExpiry = () => {
    return user.activePlan?.daysLeft || 0
  }

  const getUsagePercentage = () => {
    if (!user.activePlan?.dataUsed || !user.activePlan?.dataTotal) return 0
    return (user.activePlan.dataUsed / user.activePlan.dataTotal) * 100
  }

  const recommendedAmounts = getRecommendedAmounts()
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(recommendedAmounts[0]?.amount || null)
  const daysLeft = getDaysUntilExpiry()
  const usagePercent = getUsagePercentage()
  const showUrgentRecommendation = daysLeft <= 7 || usagePercent >= 80

  return (
    <Card className={`mb-6 ${showUrgentRecommendation ? 'border-2 border-esimphony-warning' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
              <i className="fas fa-credit-card text-esimphony-red mr-2"></i>
              Recommended Top-Up
            </h2>
            <p className="text-esimphony-gray text-sm mt-1">
              {isSubscription 
                ? 'Prepare for your next subscription renewal'
                : 'Stay connected with recommended balance amounts'}
            </p>
          </div>
          
          {showUrgentRecommendation && (
            <div className="bg-esimphony-warning text-esimphony-black px-2 py-1 rounded-full text-xs font-semibold">
              URGENT
            </div>
          )}
        </div>


        {/* Recommended Amounts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {recommendedAmounts.map((recommendation, index) => (
            <div
              key={index}
              className={`relative border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedRecommendation === recommendation.amount
                  ? 'border-esimphony-red bg-red-50 ring-2 ring-esimphony-red ring-opacity-20'
                  : 'border-gray-200 hover:border-esimphony-red'
              }`}
              onClick={() => handleRecommendationSelect(recommendation.amount)}
            >
              {recommendation.popular && (
                <div className="absolute -top-2 left-2 bg-esimphony-red text-esimphony-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  RECOMMENDED
                </div>
              )}

              <div className="text-center">
                <div className="text-xl font-bold text-esimphony-red mb-1">
                  ${recommendation.amount}
                </div>
                <div className="text-sm font-semibold text-esimphony-black mb-1">
                  {recommendation.label}
                </div>
                <div className="text-xs text-esimphony-gray mb-1">
                  {recommendation.description}
                </div>
                
                {recommendation.savings && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                    {recommendation.savings}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Top-Up Now Action */}
        <div className="flex">
          <Button
            variant={selectedRecommendation ? "primary" : "disabled"}
            onClick={handleTopUpNow}
            disabled={!selectedRecommendation}
            className="w-full"
          >
            <i className="fas fa-flash mr-2"></i>
            {selectedRecommendation ? `Top-Up Now $${selectedRecommendation}` : 'Select Amount First'}
          </Button>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          user={user}
          onUserUpdate={onUserUpdate}
          prefilledAmount={selectedRecommendation || undefined}
        />

        {/* Urgency Warning */}
        {showUrgentRecommendation && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle text-esimphony-warning mt-0.5 mr-2"></i>
              <div className="text-sm">
                <strong className="text-yellow-800">Action Required:</strong>
                <div className="text-yellow-700">
                  {daysLeft <= 7 && isSubscription && (
                    `Your subscription renews in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Ensure sufficient balance to avoid service interruption.`
                  )}
                  {daysLeft <= 7 && isPrepaid && (
                    `Your current plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Top up to purchase a new plan.`
                  )}
                  {usagePercent >= 80 && (
                    `You've used ${Math.round(usagePercent)}% of your data. Consider topping up for additional plans.`
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
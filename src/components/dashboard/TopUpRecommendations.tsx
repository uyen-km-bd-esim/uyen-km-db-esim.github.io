'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { User } from '@/types'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'

interface TopUpRecommendationsProps {
  user: User
}

interface RecommendedAmount {
  amount: number
  label: string
  description: string
  savings?: string
  popular?: boolean
}

export function TopUpRecommendations({ user }: TopUpRecommendationsProps) {
  const router = useRouter()

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

  const handleTopUp = (amount: number) => {
    storage.set('topUpSource', 'home-dashboard-recommendation')
    storage.set('recommendedAmount', amount)
    router.push('/top-up')
  }

  const getDaysUntilExpiry = () => {
    return user.activePlan?.daysLeft || 0
  }

  const getUsagePercentage = () => {
    if (!user.activePlan?.dataUsed || !user.activePlan?.dataTotal) return 0
    return (user.activePlan.dataUsed / user.activePlan.dataTotal) * 100
  }

  const recommendedAmounts = getRecommendedAmounts()
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

        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-esimphony-gray text-xs uppercase font-semibold mb-1">
                Current Balance
              </div>
              <div className="text-lg font-bold text-esimphony-black">
                ${user.balance.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-esimphony-gray text-xs uppercase font-semibold mb-1">
                {isSubscription ? 'Next Renewal' : 'Plan Expires'}
              </div>
              <div className="text-lg font-bold text-esimphony-black">
                {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>

          {/* Usage Bar for Prepaid */}
          {isPrepaid && user.activePlan?.dataUsed && user.activePlan?.dataTotal && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-esimphony-gray mb-1">
                <span>Data Usage</span>
                <span>{user.activePlan.dataUsed}GB / {user.activePlan.dataTotal}GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    usagePercent >= 80 ? 'bg-esimphony-warning' : 'bg-esimphony-success'
                  }`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Recommended Amounts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {recommendedAmounts.map((recommendation, index) => (
            <div
              key={index}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                recommendation.popular 
                  ? 'border-esimphony-red bg-red-50' 
                  : 'border-gray-200 hover:border-esimphony-red'
              }`}
              onClick={() => handleTopUp(recommendation.amount)}
            >
              {recommendation.popular && (
                <div className="absolute -top-2 left-3 bg-esimphony-red text-esimphony-white text-xs px-2 py-1 rounded-full font-semibold">
                  RECOMMENDED
                </div>
              )}

              <div className="text-center">
                <div className="text-2xl font-bold text-esimphony-red mb-2">
                  ${recommendation.amount}
                </div>
                <div className="text-sm font-semibold text-esimphony-black mb-1">
                  {recommendation.label}
                </div>
                <div className="text-xs text-esimphony-gray mb-2">
                  {recommendation.description}
                </div>
                
                {recommendation.savings && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    {recommendation.savings}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => handleTopUp(recommendedAmounts.find(r => r.popular)?.amount || 25)}
            className="flex-1"
          >
            <i className="fas fa-flash mr-2"></i>
            Quick Top-Up ${recommendedAmounts.find(r => r.popular)?.amount || 25}
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => {
              storage.set('topUpSource', 'home-dashboard-custom')
              router.push('/top-up')
            }}
            className="flex-1"
          >
            <i className="fas fa-cog mr-2"></i>
            Custom Amount
          </Button>
        </div>

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
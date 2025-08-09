'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AppLayout } from '@/components/layout/AppLayout'
import { PromotionsCarousel } from './PromotionsCarousel'
import { AutoRenewSection } from './AutoRenewSection'
import { PopularPlansSection } from './PopularPlansSection'
import { TopUpRecommendations } from './TopUpRecommendations'
import { ESIMStatusSection } from './ESIMStatusSection'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { DEMO_PROMOTIONS } from '@/lib/demo-data'
import { User } from '@/types'

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container-esimphony flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
        </div>
      </AppLayout>
    )
  }

  if (!user) return null

  const getBalanceDisplay = () => {
    return user.accountType === 'no-balance' || user.balance === 0
  }

  const hasActivePlan = !!user.activePlan
  const shouldShowPromotions = user.promotions && (
    user.promotions.hasReferralBonus || 
    user.promotions.seasonalOffers?.length || 
    user.promotions.regionalPromotions?.length
  )

  return (
    <AppLayout>
      <div className="container-esimphony pt-4 pb-8">
        {/* Promotions Carousel - Show for users with promotions */}
        {shouldShowPromotions && (
          <PromotionsCarousel promotions={DEMO_PROMOTIONS} />
        )}

        {/* Balance Card */}
        <Card className={`mb-6 ${getBalanceDisplay() ? 'border-2 border-esimphony-warning' : ''}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Account Balance</h2>
              <i className="fas fa-wallet text-esimphony-gray"></i>
            </div>
            
            <div className="text-3xl font-bold text-esimphony-black mb-4">
              ${user.balance.toFixed(2)}
            </div>
            
            <div className="space-y-2">
              <Link href="/top-up">
                <Button 
                  variant="topup" 
                  className={`w-full ${getBalanceDisplay() ? 'animate-pulse-slow' : ''}`}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Top-Up Balance
                </Button>
              </Link>
              
              {user.balance > 0 && (
                <p className="text-sm text-esimphony-gray text-center">
                  Sufficient balance available
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Active Plan Card */}
        {hasActivePlan ? (
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Active Plan</h2>
                <span className="text-esimphony-success text-sm font-medium">
                  <i className="fas fa-circle mr-1"></i>Active
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-esimphony-black">{user.activePlan!.name}</h3>
                  <p className="text-esimphony-gray text-sm">{user.activePlan!.country}</p>
                </div>
                
                {user.activePlan!.dataUsed !== undefined && user.activePlan!.dataTotal !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Data Usage</span>
                      <span>{user.activePlan!.dataUsed}GB / {user.activePlan!.dataTotal}GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-esimphony-success h-2 rounded-full"
                        style={{ width: `${(user.activePlan!.dataUsed / user.activePlan!.dataTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {user.activePlan!.daysLeft && (
                  <p className="text-sm text-esimphony-gray">
                    <i className="fas fa-calendar mr-1"></i>
                    {user.activePlan!.daysLeft} days remaining
                  </p>
                )}
                
                <Link href="/plans">
                  <Button variant="secondary" size="sm" className="w-full mt-4">
                    Change Plan
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Auto-Renew Section - Show for users with active plans or subscription types */}
        {(hasActivePlan || user.autoRenewal) && (
          <AutoRenewSection user={user} onUserUpdate={handleUserUpdate} />
        )}

        {/* Top-Up Recommendations - Show for users with active Prepaid or Subscription plans */}
        {hasActivePlan && (
          <TopUpRecommendations user={user} onUserUpdate={handleUserUpdate} />
        )}

        {/* Available Tariffs / Popular Plans Section */}
        <PopularPlansSection user={user} hasActivePlan={hasActivePlan} onUserUpdate={handleUserUpdate} />

        {/* eSIM Status Section - Usage, Activation, or Settings */}
        <ESIMStatusSection user={user} />

        
      </div>
    </AppLayout>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
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

  const handleLogout = () => {
    storage.clear()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="container-esimphony flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
      </div>
    )
  }

  if (!user) return null

  const getBalanceDisplay = () => {
    return user.accountType === 'no-balance' || user.balance === 0
  }

  return (
    <AppLayout>
      <div className="container-esimphony pt-4">

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
      {user.activePlan ? (
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
                <h3 className="font-semibold text-esimphony-black">{user.activePlan.name}</h3>
                <p className="text-esimphony-gray text-sm">{user.activePlan.country}</p>
              </div>
              
              {user.activePlan.dataUsed !== undefined && user.activePlan.dataTotal !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Data Usage</span>
                    <span>{user.activePlan.dataUsed}GB / {user.activePlan.dataTotal}GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-esimphony-success h-2 rounded-full"
                      style={{ width: `${(user.activePlan.dataUsed / user.activePlan.dataTotal) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {user.activePlan.daysLeft && (
                <p className="text-sm text-esimphony-gray">
                  <i className="fas fa-calendar mr-1"></i>
                  {user.activePlan.daysLeft} days remaining
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
      ) : (
        <Card className="mb-6">
          <div className="p-6 text-center">
            <div className="mb-4">
              <i className="fas fa-sim-card text-4xl text-esimphony-gray"></i>
            </div>
            <h2 className="text-lg font-semibold mb-2">Choose Your First Plan</h2>
            <p className="text-esimphony-gray mb-4">
              Select from our available eSIM plans to get connected
            </p>
            <Link href="/plans">
              <Button variant="primary" className="w-full">
                <i className="fas fa-search mr-2"></i>
                Browse Plans
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Usage Section - Show if active plan */}
      {user.activePlan && user.activePlan.dataUsed !== undefined && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-esimphony-black">
                <i className="fas fa-wifi mr-2"></i>
                Data Usage
              </h2>
              <Link href="/usage">
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Used this period</span>
                <span>{user.activePlan.dataUsed}GB / {user.activePlan.dataTotal}GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-esimphony-success h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(user.activePlan.dataUsed / user.activePlan.dataTotal!) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-esimphony-gray">
                <span>{user.activePlan.dataTotal! - user.activePlan.dataUsed}GB remaining</span>
                <span>{user.activePlan.daysLeft} days left</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/usage">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-4 text-center">
              <i className="fas fa-chart-line text-2xl text-esimphony-gray mb-2"></i>
              <p className="text-sm font-medium">Usage</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/support">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-4 text-center">
              <i className="fas fa-headset text-2xl text-esimphony-gray mb-2"></i>
              <p className="text-sm font-medium">Support</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/notifications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-4 text-center">
              <i className="fas fa-bell text-2xl text-esimphony-gray mb-2"></i>
              <p className="text-sm font-medium">Notifications</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/demo-support">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-4 text-center">
              <i className="fas fa-flask text-2xl text-esimphony-gray mb-2"></i>
              <p className="text-sm font-medium">Demo Reset</p>
            </div>
          </Card>
        </Link>
      </div>
      
      </div>
    </AppLayout>
  )
}
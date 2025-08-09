'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { User } from '@/types'

interface UsageRecord {
  id: string
  date: string
  type: 'Data' | 'SMS' | 'Voice'
  volume: string
  country: string
  cost: number
}

export function UsagePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'last-30' | 'last-90'>('current')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const router = useRouter()

  // Mock usage data
  const mockUsageRecords: UsageRecord[] = [
    {
      id: '1',
      date: '2024-08-09',
      type: 'Data',
      volume: '1.2GB',
      country: 'United States',
      cost: 0
    },
    {
      id: '2', 
      date: '2024-08-08',
      type: 'Data',
      volume: '2.1GB',
      country: 'United States',
      cost: 0
    },
    {
      id: '3',
      date: '2024-08-07',
      type: 'Data',
      volume: '1.8GB',
      country: 'Canada',
      cost: 0
    },
    {
      id: '4',
      date: '2024-08-06',
      type: 'Data',
      volume: '0.9GB',
      country: 'United States',
      cost: 0
    },
    {
      id: '5',
      date: '2024-08-05',
      type: 'Data',
      volume: '2.5GB',
      country: 'Mexico',
      cost: 0
    }
  ]

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

  const getUsagePercentage = () => {
    if (!user?.activePlan?.dataUsed || !user?.activePlan?.dataTotal) return 0
    return (user.activePlan.dataUsed / user.activePlan.dataTotal) * 100
  }

  const getUsageColor = () => {
    const percentage = getUsagePercentage()
    if (percentage > 90) return 'bg-red-500'
    if (percentage > 75) return 'bg-esimphony-warning'
    return 'bg-esimphony-success'
  }

  const filteredRecords = mockUsageRecords.filter(record => 
    selectedCountry === 'all' || record.country === selectedCountry
  )

  const uniqueCountries = Array.from(new Set(mockUsageRecords.map(r => r.country)))

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

  return (
    <AppLayout>
      <div className="container-esimphony pt-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-esimphony-white mb-2">
            Usage & Consumption
          </h1>
          <p className="text-esimphony-gray text-sm">
            Track your data usage and consumption history
          </p>
        </div>

        {/* Current Plan Usage Overview */}
        {user.activePlan ? (
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-esimphony-black">
                    {user.activePlan.name}
                  </h2>
                  <p className="text-esimphony-gray text-sm">
                    Current billing period
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-esimphony-black">
                    {user.activePlan.dataUsed}GB
                  </div>
                  <div className="text-esimphony-gray text-sm">
                    of {user.activePlan.dataTotal}GB used
                  </div>
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-esimphony-gray">Data Usage</span>
                  <span className="font-medium text-esimphony-black">
                    {getUsagePercentage().toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getUsageColor()}`}
                    style={{ width: `${getUsagePercentage()}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-esimphony-gray">
                  <span>{user.activePlan.dataTotal! - user.activePlan.dataUsed!}GB remaining</span>
                  <span>{user.activePlan.daysLeft} days left</span>
                </div>
              </div>

              {/* Usage Warning */}
              {getUsagePercentage() > 80 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-esimphony-warning mr-2"></i>
                    <span className="text-sm text-esimphony-black">
                      {getUsagePercentage() > 95 ? 
                        'You\'re almost out of data! Consider topping up or changing plan.' :
                        'You\'re using most of your data allowance.'
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="topup" size="sm" onClick={() => router.push('/top-up')}>
                  <i className="fas fa-plus mr-2"></i>
                  Add Data
                </Button>
                <Button variant="secondary" size="sm" onClick={() => router.push('/plans')}>
                  <i className="fas fa-exchange-alt mr-2"></i>
                  Change Plan
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mb-6">
            <div className="p-6 text-center">
              <i className="fas fa-sim-card text-4xl text-esimphony-gray mb-4"></i>
              <h3 className="text-lg font-semibold text-esimphony-black mb-2">
                No Active Plan
              </h3>
              <p className="text-esimphony-gray mb-4">
                Select a plan to start tracking your usage
              </p>
              <Button variant="primary" onClick={() => router.push('/plans')}>
                Browse Plans
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex flex-wrap gap-4">
              {/* Period Filter */}
              <div>
                <label className="block text-sm font-medium text-esimphony-gray mb-1">
                  Period
                </label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="bg-esimphony-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="current">Current Period</option>
                  <option value="last-30">Last 30 Days</option>
                  <option value="last-90">Last 90 Days</option>
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-esimphony-gray mb-1">
                  Country
                </label>
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-esimphony-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Countries</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Records */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-esimphony-black">
                Usage History
              </h3>
              <button className="text-esimphony-red text-sm hover:underline">
                <i className="fas fa-download mr-1"></i>
                Export PDF
              </button>
            </div>

            <div className="space-y-3">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <div key={record.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <i className={`fas ${
                          record.type === 'Data' ? 'fa-wifi' :
                          record.type === 'SMS' ? 'fa-sms' : 'fa-phone'
                        } text-esimphony-gray`}></i>
                      </div>
                      <div>
                        <div className="font-medium text-esimphony-black">
                          {record.volume} {record.type}
                        </div>
                        <div className="text-sm text-esimphony-gray">
                          {record.country} • {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-esimphony-black">
                        {record.cost > 0 ? `$${record.cost.toFixed(2)}` : 'Included'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-chart-line text-4xl text-esimphony-gray mb-4"></i>
                  <h4 className="font-semibold text-esimphony-black mb-2">
                    No usage data
                  </h4>
                  <p className="text-esimphony-gray text-sm">
                    Start using your plan to see usage history here
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Usage Tips */}
        <Card className="mb-20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-esimphony-black mb-4">
              <i className="fas fa-lightbulb mr-2"></i>
              Data Saving Tips
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <i className="fas fa-wifi text-esimphony-red mr-3 mt-1"></i>
                <div>
                  <div className="font-medium text-esimphony-black">Connect to Wi-Fi</div>
                  <div className="text-esimphony-gray">Use Wi-Fi whenever possible to conserve mobile data</div>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-compress text-esimphony-red mr-3 mt-1"></i>
                <div>
                  <div className="font-medium text-esimphony-black">Enable Data Compression</div>
                  <div className="text-esimphony-gray">Turn on data saver mode in your browser and apps</div>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-download text-esimphony-red mr-3 mt-1"></i>
                <div>
                  <div className="font-medium text-esimphony-black">Download Content on Wi-Fi</div>
                  <div className="text-esimphony-gray">Download maps, music, and videos while on Wi-Fi</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
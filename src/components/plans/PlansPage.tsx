'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { DEMO_PLANS } from '@/lib/demo-data'
import { User, Plan } from '@/types'

interface Destination {
  id: string
  name: string
  flag: string
  region: string
  planCount: number
}

interface PlanOption {
  id: string
  data: string
  price: string
  duration: string
  features: string[]
  type: 'prepaid' | 'subscription' | 'payg'
}

export function PlansPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [showDestinationSearch, setShowDestinationSearch] = useState(false)
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('')
  const [destinationTab, setDestinationTab] = useState<'countries' | 'regions'>('countries')
  const [planTypeTab, setPlanTypeTab] = useState<'prepaid' | 'subscription' | 'payg'>('prepaid')
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const router = useRouter()

  // Sample destination data
  const destinationData = {
    countries: [
      { id: 'us', name: 'United States', flag: '🇺🇸', region: 'North America', planCount: 8 },
      { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', planCount: 6 },
      { id: 'de', name: 'Germany', flag: '🇩🇪', region: 'Europe', planCount: 7 },
      { id: 'fr', name: 'France', flag: '🇫🇷', region: 'Europe', planCount: 6 },
      { id: 'jp', name: 'Japan', flag: '🇯🇵', region: 'Asia Pacific', planCount: 5 },
      { id: 'au', name: 'Australia', flag: '🇦🇺', region: 'Asia Pacific', planCount: 4 },
      { id: 'ca', name: 'Canada', flag: '🇨🇦', region: 'North America', planCount: 6 },
      { id: 'es', name: 'Spain', flag: '🇪🇸', region: 'Europe', planCount: 5 },
      { id: 'it', name: 'Italy', flag: '🇮🇹', region: 'Europe', planCount: 6 },
      { id: 'mx', name: 'Mexico', flag: '🇲🇽', region: 'Latin America', planCount: 4 },
      { id: 'br', name: 'Brazil', flag: '🇧🇷', region: 'Latin America', planCount: 3 },
      { id: 'sg', name: 'Singapore', flag: '🇸🇬', region: 'Asia Pacific', planCount: 5 },
      { id: 'th', name: 'Thailand', flag: '🇹🇭', region: 'Asia Pacific', planCount: 4 },
      { id: 'vn', name: 'Vietnam', flag: '🇻🇳', region: 'Asia Pacific', planCount: 4 },
      { id: 'kr', name: 'South Korea', flag: '🇰🇷', region: 'Asia Pacific', planCount: 5 },
      { id: 'my', name: 'Malaysia', flag: '🇲🇾', region: 'Asia Pacific', planCount: 4 },
      { id: 'ph', name: 'Philippines', flag: '🇵🇭', region: 'Asia Pacific', planCount: 3 },
      { id: 'id', name: 'Indonesia', flag: '🇮🇩', region: 'Asia Pacific', planCount: 3 },
      { id: 'nl', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', planCount: 6 }
    ],
    regions: [
      { id: 'europe', name: 'Europe', flag: '🇪🇺', region: '30+ Countries', planCount: 12 },
      { id: 'asia', name: 'Asia Pacific', flag: '🌏', region: '25+ Countries', planCount: 10 },
      { id: 'americas', name: 'Americas', flag: '🌎', region: '15+ Countries', planCount: 8 },
      { id: 'global', name: 'Global', flag: '🌍', region: '100+ Countries', planCount: 15 },
      { id: 'middle-east', name: 'Middle East', flag: '🕌', region: '10+ Countries', planCount: 6 },
      { id: 'africa', name: 'Africa', flag: '🦁', region: '20+ Countries', planCount: 7 }
    ]
  }

  // Sample plan data by type
  const planData = {
    prepaid: [
      {
        id: 'prepaid-5gb',
        data: '5 GB',
        price: '$10.00',
        duration: '7 Days',
        features: ['High-speed data', 'No activation fee', 'Instant activation'],
        type: 'prepaid' as const
      },
      {
        id: 'prepaid-10gb',
        data: '10 GB',
        price: '$15.00',
        duration: '30 Days',
        features: ['High-speed data', 'No activation fee', 'Instant activation', '24/7 support'],
        type: 'prepaid' as const
      },
      {
        id: 'prepaid-25gb',
        data: '25 GB',
        price: '$25.00',
        duration: '30 Days',
        features: ['High-speed data', 'No activation fee', 'Instant activation', '24/7 support', 'Data rollover'],
        type: 'prepaid' as const
      },
      {
        id: 'prepaid-50gb',
        data: '50 GB',
        price: '$40.00',
        duration: '30 Days',
        features: ['High-speed data', 'No activation fee', 'Instant activation', '24/7 support', 'Data rollover', 'Premium speeds'],
        type: 'prepaid' as const
      }
    ],
    subscription: [
      {
        id: 'sub-unlimited',
        data: 'Unlimited',
        price: '$60.00',
        duration: 'Monthly',
        features: ['Unlimited data', 'No throttling', '5G speeds', 'International roaming', '24/7 priority support'],
        type: 'subscription' as const
      },
      {
        id: 'sub-100gb',
        data: '100 GB',
        price: '$45.00',
        duration: 'Monthly',
        features: ['High-speed data', '5G speeds', 'International roaming', '24/7 support', 'Data rollover'],
        type: 'subscription' as const
      },
      {
        id: 'sub-50gb',
        data: '50 GB',
        price: '$35.00',
        duration: 'Monthly',
        features: ['High-speed data', '5G speeds', '24/7 support', 'Data rollover'],
        type: 'subscription' as const
      }
    ],
    payg: [
      {
        id: 'payg-1gb',
        data: '1 GB',
        price: '$3.00',
        duration: 'Pay as you go',
        features: ['High-speed data', 'No expiry', 'Pay only for what you use'],
        type: 'payg' as const
      },
      {
        id: 'payg-5gb',
        data: '5 GB',
        price: '$12.00',
        duration: 'Pay as you go',
        features: ['High-speed data', 'No expiry', 'Pay only for what you use', 'Better value'],
        type: 'payg' as const
      }
    ]
  }

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }
    
    setUser(userProfile)
    
    // Set default destination to United States
    const defaultDestination = destinationData.countries.find(country => country.id === 'us') || destinationData.countries[0]
    setSelectedDestination(defaultDestination)
    
    setIsLoading(false)
  }, [router])
  
  // Separate effect for auto-selecting first plan
  useEffect(() => {
    if (!user) return
    
    // Auto-select first plan only if user has no active plan
    if (!user.activePlan) {
      const firstPlan = planData[planTypeTab][0]
      if (firstPlan) {
        setSelectedPlan(firstPlan)
      }
    } else {
      // If user has active plan, don't preselect anything
      setSelectedPlan(null)
    }
  }, [user, planTypeTab])

  const handlePlanSelect = (plan: PlanOption) => {
    if (!user) return
    
    const planPrice = parseFloat(plan.price.replace('$', ''))

    if (user.balance < planPrice) {
      // Redirect to top-up with plan context
      storage.set('planChangeData', plan)
      storage.set('topUpSource', 'tariff-details-balance')
      router.push('/top-up')
    } else {
      // Sufficient balance - proceed with order
      const confirmMessage = `Order ${plan.data} plan for ${plan.price}?\n\nDuration: ${plan.duration}\nCountry: ${selectedDestination?.name}`
      if (confirm(confirmMessage)) {
        // Update balance and simulate order
        const updatedUser = { ...user, balance: user.balance - planPrice }
        setUser(updatedUser)
        storage.set('userProfile', updatedUser)
        alert('Plan ordered successfully!')
      }
    }
  }

  const selectDestination = (type: 'countries' | 'regions', destinationId: string) => {
    const destination = destinationData[type].find(dest => dest.id === destinationId)
    if (destination) {
      setSelectedDestination(destination)
      setShowDestinationSearch(false)
      setDestinationSearchTerm('')
    }
  }

  const getFilteredDestinations = () => {
    const destinations = destinationData[destinationTab]
    if (!destinationSearchTerm) return destinations
    
    return destinations.filter(dest => 
      dest.name.toLowerCase().includes(destinationSearchTerm.toLowerCase()) ||
      dest.region.toLowerCase().includes(destinationSearchTerm.toLowerCase())
    )
  }

  const getCurrentPlans = () => {
    return planData[planTypeTab]
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

  const currentPlans = getCurrentPlans()
  const filteredDestinations = getFilteredDestinations()

  const handlePlanComparison = (plan: Plan) => {
    if (selectedPlans.find(p => p.id === plan.id)) {
      setSelectedPlans(prev => prev.filter(p => p.id !== plan.id))
    } else if (selectedPlans.length < 3) {
      setSelectedPlans(prev => [...prev, plan])
    }
  }

  const clearComparison = () => {
    setSelectedPlans([])
    setShowComparison(false)
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-esimphony-black">
      {/* Header Section */}
      <div className="bg-esimphony-white text-esimphony-black p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            Available Plans
          </h1>
          <div className="text-right">
            <div className="text-lg font-bold text-esimphony-black">
              ${user.balance.toFixed(2)}
            </div>
            <div className="text-esimphony-gray text-xs">Balance</div>
          </div>
        </div>
        
        {/* Current Location Display */}
        <Card className="mb-4">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-2xl mr-3">{selectedDestination?.flag}</div>
                <div>
                  <h2 className="text-lg font-semibold text-esimphony-black">
                    {selectedDestination?.name}
                  </h2>
                  <p className="text-esimphony-gray text-sm">
                    {selectedDestination?.region}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDestinationSearch(!showDestinationSearch)}
                className="text-esimphony-gray hover:text-esimphony-red p-2 rounded-lg transition-colors"
                title="Change destination"
              >
                <i className="fas fa-edit text-lg"></i>
              </button>
            </div>
          </div>
        </Card>
        
        {/* Destination Search */}
        {showDestinationSearch && (
          <Card className="mb-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-esimphony-black">
                  Select your destination
                </h3>
                <button
                  onClick={() => setShowDestinationSearch(false)}
                  className="text-esimphony-gray hover:text-esimphony-red"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
              
              {/* Search Input */}
              <div className="relative mb-4">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-esimphony-gray"></i>
                <input
                  type="text"
                  placeholder="Search destination"
                  value={destinationSearchTerm}
                  onChange={(e) => setDestinationSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-esimphony-red transition-colors"
                />
              </div>
              
              {/* Destination Tabs */}
              <div className="bg-gray-100 rounded-lg p-1 mb-4 flex gap-1">
                <button
                  onClick={() => setDestinationTab('countries')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                    destinationTab === 'countries'
                      ? 'bg-esimphony-white text-esimphony-red shadow-md'
                      : 'text-esimphony-gray hover:bg-gray-200'
                  }`}
                >
                  Countries
                </button>
                <button
                  onClick={() => setDestinationTab('regions')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                    destinationTab === 'regions'
                      ? 'bg-esimphony-white text-esimphony-red shadow-md'
                      : 'text-esimphony-gray hover:bg-gray-200'
                  }`}
                >
                  Regions
                </button>
              </div>
              
              {/* Destination Lists */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    onClick={() => selectDestination(destinationTab, destination.id)}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="text-xl mr-3">{destination.flag}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black text-sm">
                        {destination.name}
                      </div>
                      <div className="text-esimphony-gray text-xs">
                        {destination.region}
                      </div>
                    </div>
                    <div className="bg-gray-100 text-esimphony-gray text-xs px-2 py-1 rounded font-medium">
                      {destination.planCount} plans
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
      
      <div className="container-esimphony">
        {/* Section Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-esimphony-white">
            Plans for {selectedDestination?.name}
          </h3>
        </div>

        {/* Plan Type Tabs */}
        <Card className="mb-6">
          <div className="p-1 flex gap-1">
            {[
              { key: 'prepaid', label: 'Prepaid' },
              { key: 'subscription', label: 'Subscription' },
              { key: 'payg', label: 'PAYG' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setPlanTypeTab(tab.key as any)
                  setSelectedPlan(null)
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  planTypeTab === tab.key
                    ? 'bg-esimphony-red text-esimphony-white'
                    : 'text-esimphony-gray hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Current Plan Highlight */}
        {user.activePlan && (
          <Card className="mb-6 border-2 border-esimphony-success bg-green-50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-esimphony-success text-xl mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-esimphony-black">
                      Current Plan: {user.activePlan.name}
                    </h3>
                    <p className="text-esimphony-gray text-sm">
                      {user.activePlan.dataUsed}GB used / {user.activePlan.dataTotal}GB total
                    </p>
                  </div>
                </div>
                <span className="bg-esimphony-success text-esimphony-white px-3 py-1 rounded-full text-sm font-semibold">
                  ACTIVE
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-esimphony-success h-2 rounded-full"
                  style={{ width: `${(user.activePlan.dataUsed! / user.activePlan.dataTotal!) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        )}


        {/* Plan Options */}
        <div className="space-y-4 mb-32">
          {currentPlans.map((plan) => {
            const planPrice = parseFloat(plan.price.replace('$', ''))
            const isSelected = selectedPlan?.id === plan.id
            const canAfford = user.balance >= planPrice
            
            return (
              <Card 
                key={plan.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  isSelected ? 'border-2 border-esimphony-red bg-red-50' : 'hover:border-esimphony-red'
                }`}
                onClick={() => {
                  // If clicking on already selected plan, unselect it
                  if (selectedPlan?.id === plan.id) {
                    setSelectedPlan(null)
                  } else {
                    setSelectedPlan(plan)
                  }
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-2xl font-bold text-esimphony-black">
                      {plan.data}
                    </div>
                    <div className="text-xl font-bold text-esimphony-red">
                      {plan.price}
                    </div>
                  </div>
                  
                  <div className="text-esimphony-gray text-sm mb-4 font-medium">
                    {plan.duration}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-esimphony-gray">
                        <span className="text-esimphony-red mr-2 mt-0.5">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {planTypeTab === 'subscription' && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-esimphony-black">Auto-Renew</span>
                          <div className="ml-2 w-5 h-5 bg-esimphony-gray rounded-full flex items-center justify-center text-white text-xs cursor-pointer" title="Your plan will be automatically renewed before it expires">
                            <i className="fas fa-info"></i>
                          </div>
                        </div>
                        <div className="w-10 h-5 bg-esimphony-gray rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {currentPlans.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-esimphony-gray mb-4"></i>
            <h3 className="text-lg font-semibold text-esimphony-white mb-2">
              No Plans Found
            </h3>
            <p className="text-esimphony-gray">
              Try selecting a different plan type or check back later
            </p>
          </div>
        )}
      </div>
      
      {/* Fixed CTA Section */}
      {selectedPlan && (
        <div className="fixed bottom-16 left-0 right-0 bg-esimphony-white border-t border-gray-200 p-3 z-10 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-esimphony-black text-sm">
                  {selectedPlan.data}
                </div>
                <div className="text-xs text-esimphony-gray">
                  {selectedPlan.duration}
                </div>
              </div>
              <div className="text-base font-bold text-esimphony-red">
                {selectedPlan.price}
              </div>
            </div>
            
            <div className="flex gap-2">
              {user.balance >= parseFloat(selectedPlan.price.replace('$', '')) ? (
                <Button
                  variant="primary"
                  onClick={() => handlePlanSelect(selectedPlan)}
                  className="w-full py-2 text-sm bg-esimphony-red hover:bg-red-600 text-white"
                >
                  <i className="fas fa-credit-card mr-1"></i>
                  Order eSIM
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    disabled
                    className="flex-1 py-2 text-sm bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Low Balance
                  </Button>
                  
                  <Button
                    variant="topup"
                    onClick={() => {
                      storage.set('topUpSource', 'tariff-details-balance')
                      router.push('/top-up')
                    }}
                    className="flex-1 py-2 text-sm bg-esimphony-warning hover:bg-yellow-500 text-esimphony-black border-0"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Top-Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  )
}
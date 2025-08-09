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
  const [autoRenewStates, setAutoRenewStates] = useState<{ [planId: string]: boolean }>({})
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [showBrowsePlans, setShowBrowsePlans] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showSuccessView, setShowSuccessView] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<PlanOption | null>(null)
  const [expandedFeatures, setExpandedFeatures] = useState<{ [planId: string]: boolean }>({})
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
    
    // Check if we should show update plan view (from dashboard navigation)
    const shouldShowUpdate = storage.get('showUpdatePlanView')
    if (shouldShowUpdate && userProfile.activePlan) {
      setShowBrowsePlans(true)
      storage.remove('showUpdatePlanView') // Clear after using
    }
    
    // Set default destination to United States
    const defaultDestination = destinationData.countries.find(country => country.id === 'us') || destinationData.countries[0]
    setSelectedDestination(defaultDestination)
    
    setIsLoading(false)
  }, [router])

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowTooltip(null)
    if (showTooltip) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showTooltip])
  
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
      // Show confirmation modal
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
      region: selectedDestination?.name || 'Unknown',
      dataUsed: 0,
      dataTotal: parseInt(pendingPlan.data.replace(/[^\d]/g, '')), // Extract number from "5 GB"
      daysLeft: pendingPlan.duration.includes('7') ? 7 : pendingPlan.duration.includes('30') ? 30 : 30,
      status: 'active',
      type: pendingPlan.type,
      price: pendingPlan.price,
      duration: pendingPlan.duration,
      autoRenew: autoRenewStates[pendingPlan.id] || false
    }
    
    // Update user with new balance and active plan
    const updatedUser = { 
      ...user, 
      balance: user.balance - planPrice,
      activePlan
    }
    setUser(updatedUser)
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
    setSelectedPlan(null)
    setShowBrowsePlans(false)  // This will show active plan view
  }

  const handleAutoRenewToggle = (planId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setAutoRenewStates(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }))
  }

  const handleInfoIconClick = (planId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setShowTooltip(showTooltip === planId ? null : planId)
  }

  const handleToggleFeatures = (planId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setExpandedFeatures(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }))
  }

  const handleUpdatePlan = () => {
    setShowBrowsePlans(true)
  }

  const handleViewUsage = () => {
    router.push('/usage')
  }

  const handleBackToActivePlan = () => {
    setShowBrowsePlans(false)
    setSelectedPlan(null)
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

  // Determine what view to show
  const shouldShowBrowsePlans = !user?.activePlan || showBrowsePlans

  // Active Plan View Component
  const renderActivePlanView = () => (
    <div className="container-esimphony">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-esimphony-white">
          Your Active Plan
        </h3>
      </div>

      <Card className="mb-6 border-2 border-esimphony-success bg-green-50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-esimphony-success text-2xl mr-4"></i>
              <div>
                <h3 className="text-xl font-semibold text-esimphony-black">
                  {user.activePlan?.name}
                </h3>
                <p className="text-esimphony-gray text-sm">
                  {selectedDestination?.name} • {user.activePlan?.region}
                </p>
              </div>
            </div>
            <span className="bg-esimphony-success text-esimphony-white px-4 py-2 rounded-full text-sm font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-esimphony-gray text-xs font-medium mb-1">Data Usage</div>
              <div className="text-esimphony-black text-lg font-bold">
                {user.activePlan?.dataUsed}GB / {user.activePlan?.dataTotal}GB
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-esimphony-gray text-xs font-medium mb-1">Days Left</div>
              <div className="text-esimphony-black text-lg font-bold">
                {user.activePlan?.daysLeft || 'N/A'}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-esimphony-success h-3 rounded-full"
              style={{ width: `${(user.activePlan?.dataUsed! / user.activePlan?.dataTotal!) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleUpdatePlan}
              className="w-full py-3 bg-esimphony-red hover:bg-red-600 text-white"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Update Plan
            </Button>
            <Button
              variant="secondary"
              onClick={handleViewUsage}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white"
            >
              <i className="fas fa-chart-line mr-2"></i>
              View Usage
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <AppLayout>
      <div className="min-h-screen bg-esimphony-black">
        {/* Show Active Plan View if user has active plan and not browsing */}
        {user.activePlan && !showBrowsePlans ? (
          renderActivePlanView()
        ) : (
          <>
            {/* Header Section */}
            <div className="bg-esimphony-white text-esimphony-black p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  {/* Back button when coming from active plan */}
                  {user.activePlan && showBrowsePlans && (
                    <button
                      onClick={handleBackToActivePlan}
                      className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <i className="fas fa-arrow-left text-esimphony-gray"></i>
                    </button>
                  )}
                  <h1 className="text-xl font-semibold">
                    {user.activePlan && showBrowsePlans ? 'Update Plan' : 'Available Plans'}
                  </h1>
                </div>
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



        {/* Plan Options */}
        <div className="space-y-3 mb-32">
          {currentPlans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id
            
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
                <div className="p-4">
                  {/* Header: Data & Price */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xl font-bold text-esimphony-black">
                      {plan.data}
                    </div>
                    <div className="text-lg font-bold text-esimphony-red">
                      {plan.price}
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="text-esimphony-gray text-sm mb-3 font-medium">
                    {plan.duration}
                  </div>
                  
                  {/* Features - Expandable view */}
                  <div className="mb-4">
                    <div className="text-xs text-esimphony-gray font-medium mb-1">Includes:</div>
                    <div className="flex flex-wrap gap-1">
                      {expandedFeatures[plan.id] ? (
                        // Show all features when expanded
                        <>
                          {plan.features.map((feature, index) => (
                            <span key={index} className="bg-gray-100 text-esimphony-gray text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          <button
                            onClick={(e) => handleToggleFeatures(plan.id, e)}
                            className="text-esimphony-red text-xs px-1 py-1 hover:underline cursor-pointer"
                          >
                            Show less
                          </button>
                        </>
                      ) : (
                        // Show compact view with expand button
                        <>
                          {plan.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="bg-gray-100 text-esimphony-gray text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {plan.features.length > 2 && (
                            <button
                              onClick={(e) => handleToggleFeatures(plan.id, e)}
                              className="text-esimphony-red text-xs px-1 py-1 hover:underline cursor-pointer"
                            >
                              +{plan.features.length - 2} more
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {planTypeTab === 'subscription' && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center relative">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-esimphony-black">Auto-Renew</span>
                          <div 
                            className="ml-2 w-6 h-6 bg-esimphony-gray rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:bg-gray-500 transition-colors"
                            onClick={(e) => handleInfoIconClick(plan.id, e)}
                          >
                            <i className="fas fa-info"></i>
                          </div>
                          
                          {/* Tooltip */}
                          {showTooltip === plan.id && (
                            <div className="absolute left-0 top-8 z-50 bg-esimphony-black text-white text-xs p-3 rounded-lg shadow-lg max-w-60 border border-gray-300">
                              <div className="mb-1 font-semibold">Auto-Renewal</div>
                              <div>Your plan will be automatically renewed before it expires using your available balance.</div>
                              <div className="absolute -top-1 left-4 w-2 h-2 bg-esimphony-black transform rotate-45"></div>
                            </div>
                          )}
                        </div>
                        
                        <div 
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                            autoRenewStates[plan.id] ? 'bg-esimphony-red' : 'bg-gray-300'
                          }`}
                          onClick={(e) => handleAutoRenewToggle(plan.id, e)}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            autoRenewStates[plan.id] ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
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
                  Order
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
          </>
        )}

        {/* Confirmation Modal */}
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
                  {selectedDestination?.name}
                </div>
                {pendingPlan.type === 'subscription' && autoRenewStates[pendingPlan.id] && (
                  <div className="mt-2 text-xs text-esimphony-gray bg-yellow-50 p-2 rounded">
                    <i className="fas fa-info-circle mr-1"></i>
                    Auto-renewal enabled
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleCancelOrder}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-esimphony-black"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmOrder}
                  className="flex-1 py-3 bg-esimphony-red hover:bg-red-600 text-white"
                >
                  Confirm Order
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
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
                  {selectedDestination?.name}
                </div>
                <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                  <i className="fas fa-check-circle mr-1"></i>
                  Plan activated and ready to use
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleSuccessClose}
                className="w-full py-3 bg-esimphony-red hover:bg-red-600 text-white"
              >
                <i className="fas fa-eye mr-2"></i>
                View My Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
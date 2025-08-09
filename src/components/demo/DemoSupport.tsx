'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { DEMO_ACCOUNTS, DEMO_PLANS, DEMO_PROMOTIONS } from '@/lib/demo-data'
import { DemoAccount } from '@/types'

export function DemoSupport() {
  const [isResetting, setIsResetting] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const [loggingInAccount, setLoggingInAccount] = useState<string | null>(null)
  
  // Custom account generator state
  const [customAccountName, setCustomAccountName] = useState('TestUser')
  const [customBalance, setCustomBalance] = useState(25.00)
  const [customEsimStatus, setCustomEsimStatus] = useState<'none' | 'available' | 'installed' | 'active'>('none')
  const [customHasPlan, setCustomHasPlan] = useState(false)
  const [customHasPromotions, setCustomHasPromotions] = useState(false)
  const [customActivationBehavior, setCustomActivationBehavior] = useState<'random' | 'success' | 'fail'>('random')
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false)
  
  const router = useRouter()

  const handleReset = async () => {
    setIsResetting(true)
    
    // Simulate reset process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear all localStorage
    storage.clear()
    
    setIsResetting(false)
    setResetComplete(true)
    
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  const generateCustomAccount = async () => {
    setIsGeneratingCustom(true)
    
    // Create custom account based on selections
    const customAccount: DemoAccount = {
      email: 'custom@esim.demo',
      password: '123456',
      profile: {
        firstName: customAccountName,
        lastName: 'Custom',
        email: 'custom@esim.demo',
        balance: customBalance,
        activePlan: customHasPlan ? DEMO_PLANS[0] : null,
        accountType: customBalance > 0 ? (customHasPlan ? 'has-plan' : 'has-balance') : 'no-balance',
        esimStatus: customEsimStatus === 'none' ? undefined : customEsimStatus,
        activationBehavior: customActivationBehavior === 'random' ? undefined : customActivationBehavior,
        promotions: customHasPromotions ? {
          hasReferralBonus: true,
          seasonalOffers: ['winter-2024'],
          regionalPromotions: ['asia-special']
        } : undefined,
        usageData: customEsimStatus === 'active' ? {
          planName: customHasPlan ? DEMO_PLANS[0].name : 'Custom Plan',
          dataUsed: 3.2,
          dataTotal: customHasPlan ? DEMO_PLANS[0].dataTotal || 10 : 10,
          expirationDays: 15
        } : undefined,
        autoRenewal: customHasPlan ? {
          enabled: true,
          renewalDate: 'Mar 1, 2024',
          renewalAmount: customHasPlan ? DEMO_PLANS[0].price : 25
        } : undefined
      }
    }
    
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Login with custom account
    await loginAsAccount(customAccount)
  }

  const loginAsAccount = async (account: DemoAccount) => {
    setLoggingInAccount(account.email)
    
    // Clear all existing localStorage data first
    storage.clear()
    
    // Set up account-specific data
    const userProfile = {
      ...account.profile,
      isAuthenticated: true
    }
    
    // Store user data in localStorage
    storage.set('userProfile', userProfile)
    storage.set('isAuthenticated', true)
    storage.set('userFirstName', account.profile.firstName)
    storage.set('userBalance', account.profile.balance)
    storage.set('userEmail', account.email)
    
    if (account.profile.activePlan) {
      storage.set('userActivePlan', account.profile.activePlan)
    }
    
    // Show loading for 1 second then redirect
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const successMessage = `Logged in as ${account.profile.firstName}! Balance: $${account.profile.balance.toFixed(2)}${account.profile.activePlan ? `, Active plan: ${account.profile.activePlan.name}` : ''}${account.profile.esimStatus ? `, eSIM: ${account.profile.esimStatus}` : ''}`
    
    alert(successMessage + '\n\nRedirecting to dashboard...')
    router.push('/dashboard')
  }

  const getBadgeColor = (accountType: string, esimStatus?: string) => {
    if (esimStatus === 'active') return 'bg-esimphony-success text-white'
    if (esimStatus === 'available') return 'bg-orange-500 text-white'
    if (accountType === 'has-plan') return 'bg-esimphony-info text-white'
    if (accountType === 'has-balance') return 'bg-esimphony-success text-white'
    if (accountType === 'no-balance') return 'bg-esimphony-warning text-black'
    return 'bg-gray-500 text-white'
  }

  const getBadgeText = (account: DemoAccount) => {
    const badges = []
    
    if (account.profile.balance > 0) {
      badges.push(`$${account.profile.balance.toFixed(2)} Balance`)
    } else {
      badges.push('$0.00 Balance')
    }
    
    if (account.profile.activePlan) {
      badges.push(`${account.profile.activePlan.name} Active`)
    } else {
      badges.push('No Active Plan')
    }
    
    if (account.profile.esimStatus === 'available') {
      badges.push('eSIM Available')
    } else if (account.profile.esimStatus === 'active') {
      badges.push('eSIM Active')
    }
    
    if (account.profile.activationBehavior === 'fail') {
      badges.push('Activation Fails')
    } else if (account.profile.activationBehavior === 'success') {
      badges.push('Activation Success')
    }
    
    return badges
  }

  if (resetComplete) {
    return (
      <div className="container-esimphony flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-esimphony-black mb-4">
              Reset Complete!
            </h1>
            <p className="text-esimphony-gray mb-6">
              All demo data has been cleared. Redirecting to welcome screen...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-esimphony-red mx-auto" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-esimphony-black">
      <div className="container-esimphony pt-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/" className="text-esimphony-white hover:text-esimphony-red mr-4">
            <i className="fas fa-arrow-left text-xl"></i>
          </Link>
          <div className="text-xl font-bold text-esimphony-white">
            eSimphony
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-esimphony-white mb-2 text-center">
            Demo Support
          </h1>
          <p className="text-esimphony-gray text-center mb-8">
            Complete testing guide for eSimphony platform
          </p>

          {/* Custom Account Generator */}
          <Card className="mb-6 border-2 border-esimphony-info">
            <div className="p-6">
              <h2 className="text-xl font-bold text-esimphony-black mb-4 flex items-center">
                <i className="fas fa-magic text-esimphony-info mr-3"></i>
                Custom Test Account Generator
              </h2>
              <p className="text-esimphony-gray mb-6">
                Create a custom test account with specific conditions. Select your preferences below, then generate and auto-login with the custom account.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Account Name */}
                <div>
                  <label className="block text-sm font-semibold text-esimphony-black mb-2">
                    <i className="fas fa-user text-esimphony-info mr-1"></i>
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={customAccountName}
                    onChange={(e) => setCustomAccountName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-esimphony-red"
                    placeholder="TestUser"
                  />
                </div>

                {/* Balance */}
                <div>
                  <label className="block text-sm font-semibold text-esimphony-black mb-2">
                    <i className="fas fa-dollar-sign text-green-600 mr-1"></i>
                    Balance ($)
                  </label>
                  <input
                    type="number"
                    value={customBalance}
                    onChange={(e) => setCustomBalance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-esimphony-red"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* eSIM Status */}
                <div>
                  <label className="block text-sm font-semibold text-esimphony-black mb-2">
                    <i className="fas fa-sim-card text-orange-600 mr-1"></i>
                    eSIM Status
                  </label>
                  <select
                    value={customEsimStatus}
                    onChange={(e) => setCustomEsimStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-esimphony-red"
                  >
                    <option value="none">None</option>
                    <option value="available">Available (Ready to activate)</option>
                    <option value="installed">Installed (Settings mode)</option>
                    <option value="active">Active (Usage stats)</option>
                  </select>
                </div>

                {/* Has Active Plan */}
                <div>
                  <label className="block text-sm font-semibold text-esimphony-black mb-2">
                    <i className="fas fa-mobile-alt text-blue-600 mr-1"></i>
                    Active Plan
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customHasPlan}
                      onChange={(e) => setCustomHasPlan(e.target.checked)}
                      className="mr-2 text-esimphony-red focus:ring-esimphony-red"
                    />
                    <span className="text-sm">Has active plan (Euro Data Pass)</span>
                  </label>
                </div>

                {/* Has Promotions */}
                <div>
                  <label className="block text-sm font-semibold text-esimphony-black mb-2">
                    <i className="fas fa-star text-yellow-600 mr-1"></i>
                    Promotions
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customHasPromotions}
                      onChange={(e) => setCustomHasPromotions(e.target.checked)}
                      className="mr-2 text-esimphony-red focus:ring-esimphony-red"
                    />
                    <span className="text-sm">Show promotions carousel</span>
                  </label>
                </div>

                {/* Activation Behavior */}
                <div>
                  <label className="block text-sm font-semibold text-esimphony-black mb-2">
                    <i className="fas fa-cog text-purple-600 mr-1"></i>
                    Activation Test
                  </label>
                  <select
                    value={customActivationBehavior}
                    onChange={(e) => setCustomActivationBehavior(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-esimphony-red"
                  >
                    <option value="random">Random (80% success)</option>
                    <option value="success">Always succeed</option>
                    <option value="fail">Always fail</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <Button
                  variant="primary"
                  onClick={generateCustomAccount}
                  disabled={isGeneratingCustom}
                  isLoading={isGeneratingCustom}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-esimphony-info to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isGeneratingCustom ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating & Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Generate & Login Custom Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Demo Accounts Section */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-esimphony-black mb-4 flex items-center">
                <i className="fas fa-users text-esimphony-red mr-3"></i>
                Pre-configured Demo Accounts
              </h2>
              <p className="text-esimphony-gray mb-6">
                Use these pre-configured accounts to test different user scenarios. Click the <strong>"Login as [Name]"</strong> button to instantly log in with that account's settings and be redirected to the home dashboard. Traditional login with password <strong>123456</strong> is also available.
              </p>
              
              <div className="space-y-6">
                {DEMO_ACCOUNTS.map((account, index) => (
                  <div key={index} className="bg-gray-50 border-l-4 border-esimphony-red rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center mb-2">
                          <i className="fas fa-envelope text-esimphony-red mr-2"></i>
                          <h3 className="text-lg font-semibold text-esimphony-black">
                            {account.email}
                          </h3>
                        </div>
                        <div className="flex items-center mb-2">
                          <i className="fas fa-key text-esimphony-info mr-2"></i>
                          <span className="text-sm text-esimphony-info">
                            Password: {account.password}
                          </span>
                        </div>
                        <p className="text-esimphony-gray mb-3">
                          <strong>{account.profile.firstName} {account.profile.lastName || ''}</strong> - {account.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Feature Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getBadgeText(account).map((badge, badgeIndex) => (
                        <span 
                          key={badgeIndex} 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            badge.includes('$0.00') ? 'bg-esimphony-warning text-black' :
                            badge.includes('Balance') && !badge.includes('$0.00') ? 'bg-esimphony-success text-white' :
                            badge.includes('Active') && !badge.includes('No') ? 'bg-esimphony-info text-white' :
                            badge.includes('No Active') ? 'bg-gray-500 text-white' :
                            badge.includes('Available') ? 'bg-orange-500 text-white' :
                            badge.includes('Success') ? 'bg-esimphony-success text-white' :
                            badge.includes('Fails') ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    
                    {/* Quick Login Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => loginAsAccount(account)}
                      disabled={loggingInAccount === account.email}
                      isLoading={loggingInAccount === account.email}
                      className="flex items-center gap-2"
                    >
                      {loggingInAccount === account.email ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt"></i>
                          Login as {account.profile.firstName}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Complete Use Case Testing Flows */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-esimphony-black mb-4 flex items-center">
                <i className="fas fa-bullseye text-esimphony-red mr-3"></i>
                Complete Use Case Testing Flows
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border-l-4 border-esimphony-info rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="bg-esimphony-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-esimphony-black mb-2">
                        Use Case 1: New User Registration & Top-Up
                      </h3>
                      <p className="text-esimphony-gray text-sm mb-3">
                        Test the complete new user onboarding process with account creation and first top-up.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/register" className="bg-esimphony-black text-esimphony-white px-3 py-1 rounded text-xs hover:bg-gray-800">
                          register
                        </Link>
                        <Link href="/top-up" className="bg-esimphony-black text-esimphony-white px-3 py-1 rounded text-xs hover:bg-gray-800">
                          top-up
                        </Link>
                        <Link href="/dashboard" className="bg-esimphony-black text-esimphony-white px-3 py-1 rounded text-xs hover:bg-gray-800">
                          dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border-l-4 border-esimphony-info rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="bg-esimphony-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-esimphony-black mb-2">
                        Use Case 2: Plan Purchase Journey
                      </h3>
                      <p className="text-esimphony-gray text-sm mb-3">
                        Navigate through country selection, plan comparison, and purchase confirmation flows.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/destinations" className="bg-esimphony-black text-esimphony-white px-3 py-1 rounded text-xs hover:bg-gray-800">
                          destinations
                        </Link>
                        <Link href="/plans" className="bg-esimphony-black text-esimphony-white px-3 py-1 rounded text-xs hover:bg-gray-800">
                          plans
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border-l-4 border-esimphony-info rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="bg-esimphony-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-esimphony-black mb-2">
                        Use Case 3: Plan Change Management
                      </h3>
                      <p className="text-esimphony-gray text-sm mb-3">
                        Test plan modification flows with warning dialogs and confirmation modals for users with active plans.
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Login with:</strong> exist-plan@esim.demo → 
                        <Link href="/dashboard" className="bg-esimphony-black text-esimphony-white px-2 py-1 rounded text-xs ml-2 hover:bg-gray-800">
                          dashboard
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border-l-4 border-esimphony-info rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="bg-esimphony-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">4</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-esimphony-black mb-2">
                        Use Case 4: eSIM Activation & Usage Management
                      </h3>
                      <p className="text-esimphony-gray text-sm mb-3">
                        Test eSIM activation flows and active usage monitoring with different eSIM states.
                      </p>
                      <div className="text-sm space-y-2">
                        <p>
                          <strong>eSIM Available:</strong> esim-available@esim.demo → 
                          <Link href="/dashboard" className="bg-esimphony-black text-esimphony-white px-2 py-1 rounded text-xs ml-2 hover:bg-gray-800">
                            dashboard (Activate Button)
                          </Link>
                        </p>
                        <p>
                          <strong>eSIM Installed:</strong> esim-installed@esim.demo → 
                          <Link href="/dashboard" className="bg-esimphony-black text-esimphony-white px-2 py-1 rounded text-xs ml-2 hover:bg-gray-800">
                            dashboard (Settings Mode)
                          </Link>
                          <Link href="/esim-settings" className="bg-esimphony-black text-esimphony-white px-2 py-1 rounded text-xs ml-2 hover:bg-gray-800">
                            esim settings
                          </Link>
                        </p>
                        <p>
                          <strong>eSIM Active:</strong> esim-active@esim.demo → 
                          <Link href="/dashboard" className="bg-esimphony-black text-esimphony-white px-2 py-1 rounded text-xs ml-2 hover:bg-gray-800">
                            dashboard (Usage Stats)
                          </Link>
                          <Link href="/usage" className="bg-esimphony-black text-esimphony-white px-2 py-1 rounded text-xs ml-2 hover:bg-gray-800">
                            usage details
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border-l-4 border-esimphony-info rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="bg-esimphony-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">5</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-esimphony-black mb-2">
                        Multi-Account Demo System
                      </h3>
                      <p className="text-esimphony-gray text-sm mb-3">
                        Experience different user personas with account-specific UI modifications and data states.
                      </p>
                      <p className="text-sm">
                        <strong>Features:</strong> Profile-based greetings, balance-specific UI animations, account-type conditional styling
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Testing Instructions */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-esimphony-black mb-4 flex items-center">
                <i className="fas fa-flask text-esimphony-red mr-3"></i>
                Testing Instructions
              </h2>
              
              <div className="mb-6">
                <h3 className="font-semibold text-esimphony-black mb-4">Quick Test Scenarios</h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>🆕 New User Flow:</strong> Register → Top-up → Select Destination → Choose Plan → Purchase
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>💰 Existing User (Has Balance):</strong> Login with exist-topup@esim.demo → Select Destination → Purchase Plan
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>📱 Plan Change Flow:</strong> Login with exist-plan@esim.demo → Home Dashboard → Change Plan → Confirm Warning
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>🔄 Reset Between Tests:</strong> Use Reset button below to clear all demo data and start fresh
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-esimphony-black mb-4">Key Features to Test</h3>
              <ul className="text-esimphony-gray space-y-2 text-sm">
                <li>• Responsive design on different screen sizes</li>
                <li>• Form validation and error handling</li>
                <li>• Modal dialog interactions and confirmations</li>
                <li>• Navigation source tracking and routing logic</li>
                <li>• Account-specific UI modifications and animations</li>
                <li>• LocalStorage persistence across page reloads</li>
              </ul>
            </div>
          </Card>
          
          {/* Reset Section */}
          <Card className="mb-6 border-2 border-esimphony-warning">
            <div className="p-6">
              <h2 className="text-lg font-bold text-esimphony-warning mb-4">
                🔄 Reset Demo Environment
              </h2>
              <p className="text-esimphony-gray mb-4">
                Clear all stored demo data and return to a clean testing state. Use this between test scenarios to ensure accurate results.
              </p>
              
              <Button 
                variant="secondary" 
                onClick={handleReset}
                isLoading={isResetting}
                className="w-full border-esimphony-warning text-esimphony-warning hover:bg-esimphony-warning hover:text-esimphony-white"
              >
                {isResetting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Resetting Application...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-restore mr-2"></i>
                    Reset All Demo Data
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Start Testing Button */}
          <div className="text-center mb-8">
            <Link href="/login" className="inline-block bg-esimphony-red text-esimphony-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors">
              Start Testing with Demo Accounts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { User } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ESIMStatusSectionProps {
  user: User
}

export function ESIMStatusSection({ user }: ESIMStatusSectionProps) {
  const router = useRouter()

  // Always show eSIM section - determine device compatibility and status
  const getESIMStatus = () => {
    // Check device compatibility first
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : ''
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)
    const isESIMSupported = isIOS || isAndroid // In real app, would check actual eSIM support
    
    if (!isESIMSupported) {
      return 'incompatible'
    }
    
    // If device supports eSIM, check if user has eSIM profiles and their activation status
    if (user.esimStatus === 'active' && user.usageData) {
      return 'active' // Show usage section when eSIM is active with data
    } else if (user.esimStatus === 'active' || user.esimStatus === 'installed') {
      return 'settings' // Show settings when eSIM profile exists but may need configuration
    } else {
      return 'available' // Show activation when device supports eSIM but no profile exists yet
    }
  }

  const esimStatus = getESIMStatus()

  const renderActiveESIM = () => {
    if (!user.usageData) return null

    const usagePercentage = Math.round((user.usageData.dataUsed / user.usageData.dataTotal) * 100)
    const dataRemaining = user.usageData.dataTotal - user.usageData.dataUsed

    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
              <i className="fas fa-wifi text-esimphony-success mr-2"></i>
              Data Usage
            </h2>
            <span className="bg-esimphony-success text-esimphony-white text-xs px-2 py-1 rounded-full font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="space-y-4">
            {/* Plan Info */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-esimphony-black">
                  {user.usageData.planName}
                </h3>
                <p className="text-esimphony-gray text-sm">
                  Expires in {user.usageData.expirationDays} days
                </p>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-esimphony-gray font-medium mb-1">USED</div>
                <div className="text-lg font-bold text-esimphony-black">
                  {user.usageData.dataUsed} GB
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-esimphony-gray font-medium mb-1">REMAINING</div>
                <div className="text-lg font-bold text-esimphony-black">
                  {dataRemaining.toFixed(1)} GB
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-esimphony-gray font-medium mb-1">EXPIRES</div>
                <div className="text-lg font-bold text-esimphony-black">
                  {user.usageData.expirationDays} days
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-esimphony-gray">Usage Progress</span>
                <span className="font-semibold text-esimphony-black">{usagePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    usagePercentage >= 90 ? 'bg-esimphony-red' :
                    usagePercentage >= 75 ? 'bg-esimphony-warning' :
                    'bg-esimphony-success'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <div className="text-center text-xs text-esimphony-gray mt-2">
                {usagePercentage}% used of total allowance
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link href="/usage" className="flex-1">
                <Button variant="primary" className="w-full">
                  <i className="fas fa-chart-line mr-2"></i>
                  Usage
                </Button>
              </Link>
              <Link href="/esim-settings" className="flex-1">
                <Button variant="primary" className="w-full bg-esimphony-gray hover:bg-gray-600">
                  <i className="fas fa-cog mr-2"></i>
                  Settings
                </Button>
              </Link>
            </div>

            {/* Usage Warning */}
            {usagePercentage >= 75 && (
              <div className={`p-3 rounded-lg border ${
                usagePercentage >= 90 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start">
                  <i className={`fas ${
                    usagePercentage >= 90 ? 'fa-exclamation-circle text-esimphony-red' : 'fa-exclamation-triangle text-esimphony-warning'
                  } mt-0.5 mr-2`}></i>
                  <div className="text-sm">
                    <strong className={usagePercentage >= 90 ? 'text-red-800' : 'text-yellow-800'}>
                      {usagePercentage >= 90 ? 'Data Almost Exhausted!' : 'High Data Usage'}
                    </strong>
                    <div className={usagePercentage >= 90 ? 'text-red-700' : 'text-yellow-700'}>
                      {usagePercentage >= 90 
                        ? 'You have less than 10% data remaining. Consider purchasing a new plan.'
                        : 'You\'ve used over 75% of your data allowance.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  const renderAvailableESIM = () => {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
              <i className="fas fa-sim-card text-esimphony-warning mr-2"></i>
              Activate eSIM
            </h2>
            <span className="bg-esimphony-warning text-esimphony-black text-xs px-2 py-1 rounded-full font-semibold">
              READY
            </span>
          </div>

          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-power-off text-esimphony-white text-2xl"></i>
            </div>
            
            <h3 className="text-lg font-semibold text-esimphony-black mb-2">
              Activate eSIM Now
            </h3>
            <p className="text-esimphony-gray mb-6">
              No eSIM profile installed yet. Complete a plan purchase first, then activate your eSIM profile here.
            </p>

            <div className="flex gap-3">
              <Link href="/activate-esim" className="flex-1">
                <Button variant="primary" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <i className="fas fa-power-off mr-2"></i>
                  Activate eSIM
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-esimphony-gray text-sm">Don't have a plan yet?</span>
              <Link href="/plans">
                <Button variant="primary" size="sm" className="bg-esimphony-red hover:bg-esimphony-red transform-none shadow-none">
                  <i className="fas fa-shopping-cart mr-1"></i>
                  Browse Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const renderESIMSettings = () => {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
              <i className="fas fa-cog text-esimphony-gray mr-2"></i>
              eSIM Settings
            </h2>
            <span className="bg-esimphony-info text-esimphony-white text-xs px-2 py-1 rounded-full font-semibold">
              INSTALLED
            </span>
          </div>

          <p className="text-esimphony-gray text-sm mb-4">
            eSIM profile installed. Configure settings and activate your connection.
          </p>

          <div className="space-y-3">
            <Link href="/esim-settings">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-cog text-esimphony-gray"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-esimphony-black text-sm">
                      eSIM Configuration
                    </div>
                    <div className="text-esimphony-gray text-xs">
                      View QR code and activation details
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-esimphony-gray"></i>
              </div>
            </Link>

            <Link href="/activate-esim">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-mobile-alt text-esimphony-gray"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-esimphony-black text-sm">
                      Setup Instructions
                    </div>
                    <div className="text-esimphony-gray text-xs">
                      Platform-specific activation guidance
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-esimphony-gray"></i>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  const renderIncompatibleESIM = () => {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
              <i className="fas fa-exclamation-triangle text-esimphony-warning mr-2"></i>
              eSIM Status
            </h2>
            <span className="bg-esimphony-warning text-esimphony-black text-xs px-2 py-1 rounded-full font-semibold">
              INCOMPATIBLE
            </span>
          </div>

          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-times text-esimphony-white text-2xl"></i>
            </div>
            
            <h3 className="text-lg font-semibold text-esimphony-black mb-2">
              Device Not Compatible
            </h3>
            <p className="text-esimphony-gray mb-6 text-sm">
              Your device doesn't support eSIM technology. You can still use eSimphony with a physical SIM card.
            </p>

            <div className="space-y-3">
              <Link href="/support">
                <Button variant="secondary" className="w-full">
                  <i className="fas fa-question-circle mr-2"></i>
                  Check Compatibility
                </Button>
              </Link>
              <Link href="/plans">
                <Button variant="primary" className="w-full">
                  <i className="fas fa-mobile-alt mr-2"></i>
                  View Physical SIM Plans
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-esimphony-warning mt-0.5 mr-2"></i>
                <div className="text-sm">
                  <strong className="text-orange-800">eSIM Requirements:</strong>
                  <div className="text-orange-700">
                    eSIM requires iOS 12+ on iPhone XS/XR or newer, or Android 9+ with eSIM support.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Always render one of the four eSIM states based on device compatibility and user status
  switch (esimStatus) {
    case 'incompatible':
      return renderIncompatibleESIM()
    case 'active':
      return renderActiveESIM()
    case 'settings':
      return renderESIMSettings()
    case 'available':
    default:
      return renderAvailableESIM()
  }
}
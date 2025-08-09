'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { User } from '@/types'

interface ActivationData {
  smdpAddress: string
  activationCode: string
  confirmationCode: string
  qrCodeData: string
}

export function ActivateESIM() {
  const [user, setUser] = useState<User | null>(null)
  const [currentFlow, setCurrentFlow] = useState<'automatic' | 'manual' | 'success'>('automatic')
  const [isActivating, setIsActivating] = useState(false)
  const [buttonText, setButtonText] = useState('Activate eSIM')
  const [activationData] = useState<ActivationData>({
    smdpAddress: '1$smdp.esimphony.com$activation_code_123456',
    activationCode: 'ESIM-ACT-789012345',
    confirmationCode: 'CONF-789123',
    qrCodeData: 'LPA:1$smdp.esimphony.com$activation_code_123456'
  })
  const router = useRouter()

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }
    
    setUser(userProfile)
  }, [router])

  const checkDeviceSupport = () => {
    // Check if device supports SM-DP+ (Carrier Bundle SDK access simulation)
    const userAgent = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)
    
    // Simulate SM-DP+ support detection
    // In real implementation, this would check for actual carrier bundle SDK
    return isIOS || isAndroid
  }

  const startActivation = async () => {
    if (!user) return

    setIsActivating(true)
    setButtonText('Activating...')

    try {
      const supportsAutoActivation = checkDeviceSupport()
      
      if (supportsAutoActivation) {
        // Simulate automatic activation attempt
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Check user's activation behavior for demo
        const activationBehavior = user.activationBehavior
        let activationSuccess
        
        if (activationBehavior === 'fail') {
          activationSuccess = false
        } else if (activationBehavior === 'success') {
          activationSuccess = true
        } else {
          // Default random behavior (80% success rate)
          activationSuccess = Math.random() > 0.2
        }

        if (activationSuccess) {
          // Update user profile to active eSIM
          const updatedUser = {
            ...user,
            esimStatus: 'active' as const,
            usageData: {
              planName: user.activePlan?.name || 'eSimphony Plan',
              dataUsed: 0,
              dataTotal: user.activePlan?.dataTotal || 10,
              expirationDays: 30
            }
          }
          
          storage.set('userProfile', updatedUser)
          setUser(updatedUser)
          
          // Also send QR code by email (simulated)
          console.log('Sending activation QR code to user email...')
          
          setCurrentFlow('success')
        } else {
          // Auto-activation failed, show manual flow
          setIsActivating(false)
          setButtonText('Activation Failed')
          
          setTimeout(() => {
            const failureMessage = activationBehavior === 'fail' 
              ? 'Automatic activation failed as expected for this test account. Switching to manual setup.' 
              : 'Automatic activation failed. Please use manual setup.'
            
            alert(failureMessage)
            setCurrentFlow('manual')
            generateQRCode()
          }, 1000)
          return
        }
      } else {
        // Device doesn't support automatic activation
        setCurrentFlow('manual')
        generateQRCode()
      }
    } catch (error) {
      console.error('Activation error:', error)
      setCurrentFlow('manual')
      generateQRCode()
    }
    
    setIsActivating(false)
  }

  const generateQRCode = () => {
    // In real implementation, this would generate actual QR code
    // For now, we simulate QR code generation
    console.log('Generated QR Code data:', activationData.qrCodeData)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show toast notification
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-esimphony-success text-white px-4 py-2 rounded-lg z-50'
      toast.textContent = `${type} copied to clipboard!`
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    })
  }

  const goToHome = () => {
    storage.remove('activatingPlan')
    storage.remove('selectedPlan')
    router.push('/dashboard')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-esimphony-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-esimphony-black">
      <div className="container-esimphony pt-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="text-esimphony-white hover:text-esimphony-red mr-4">
            <i className="fas fa-arrow-left text-xl"></i>
          </Link>
          <h1 className="text-xl font-bold text-esimphony-white">
            eSIM Activation
          </h1>
        </div>

        <div className="max-w-md mx-auto">
          {/* Automatic Activation Flow */}
          {currentFlow === 'automatic' && (
            <Card className="text-center">
              <div className="p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-mobile-alt text-3xl text-esimphony-gray"></i>
                </div>
                
                <h2 className="text-2xl font-bold text-esimphony-black mb-4">
                  Activate Your eSIM
                </h2>
                <p className="text-esimphony-gray mb-8 leading-relaxed">
                  Tap the button below to automatically install and activate your eSIM profile. This may take a moment.
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={startActivation}
                  disabled={isActivating}
                  isLoading={isActivating}
                  className="w-full mb-4 min-h-[64px] text-lg font-semibold"
                >
                  {isActivating ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      {buttonText}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-power-off mr-2"></i>
                      {buttonText}
                    </>
                  )}
                </Button>

                <button
                  onClick={() => {
                    setCurrentFlow('manual')
                    generateQRCode()
                  }}
                  className="text-esimphony-gray hover:text-esimphony-black text-sm font-medium transition-colors"
                >
                  Need manual setup?
                </button>
              </div>
            </Card>
          )}

          {/* Manual Activation Flow */}
          {currentFlow === 'manual' && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-esimphony-black mb-6 text-center">
                  Manual eSIM Setup
                </h2>

                {/* QR Code Section */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                  <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-qrcode text-4xl text-esimphony-gray mb-2"></i>
                      <div className="text-sm text-esimphony-gray">
                        📱 Scan with your device
                      </div>
                      <div className="text-xs text-esimphony-gray mt-1">
                        QR Code will appear here
                      </div>
                    </div>
                  </div>
                  <p className="text-esimphony-gray text-sm">
                    <strong>Scan this QR code</strong> with your device camera or use manual setup below
                  </p>
                </div>

                {/* Setup Instructions */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start bg-gray-50 rounded-lg p-4">
                    <div className="w-7 h-7 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Open Device Settings</div>
                      <div className="text-sm text-esimphony-gray">
                        <strong>iOS:</strong> Settings → Cellular → Add Cellular Plan<br/>
                        <strong>Android:</strong> Settings → Network & Internet → Mobile Network
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start bg-gray-50 rounded-lg p-4">
                    <div className="w-7 h-7 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Scan QR Code or Add Manually</div>
                      <div className="text-sm text-esimphony-gray">
                        Use your camera to scan the QR code above, or select "Enter Details Manually"
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start bg-gray-50 rounded-lg p-4">
                    <div className="w-7 h-7 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Complete Setup</div>
                      <div className="text-sm text-esimphony-gray">
                        Follow the on-screen prompts to complete installation. You may need to restart your device.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start bg-gray-50 rounded-lg p-4">
                    <div className="w-7 h-7 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                      4
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Configure eSIM</div>
                      <div className="text-sm text-esimphony-gray">
                        Enable eSIM, turn on Data Roaming, and set APN to <strong>esimphony.flex</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Entry Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-esimphony-black mb-4">Manual Entry Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-esimphony-gray mb-1">SM-DP+ Address:</div>
                      <div 
                        className="bg-white p-3 rounded border font-mono text-sm cursor-pointer hover:bg-gray-50 relative"
                        onClick={() => copyToClipboard(activationData.smdpAddress, 'SM-DP+ Address')}
                      >
                        {activationData.smdpAddress}
                        <i className="fas fa-copy absolute right-3 top-3 text-esimphony-gray hover:text-esimphony-red"></i>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-esimphony-gray mb-1">Activation Code:</div>
                      <div 
                        className="bg-white p-3 rounded border font-mono text-sm cursor-pointer hover:bg-gray-50 relative"
                        onClick={() => copyToClipboard(activationData.activationCode, 'Activation Code')}
                      >
                        {activationData.activationCode}
                        <i className="fas fa-copy absolute right-3 top-3 text-esimphony-gray hover:text-esimphony-red"></i>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-esimphony-gray mb-1">Confirmation Code:</div>
                      <div 
                        className="bg-white p-3 rounded border font-mono text-sm cursor-pointer hover:bg-gray-50 relative"
                        onClick={() => copyToClipboard(activationData.confirmationCode, 'Confirmation Code')}
                      >
                        {activationData.confirmationCode}
                        <i className="fas fa-copy absolute right-3 top-3 text-esimphony-gray hover:text-esimphony-red"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button variant="primary" onClick={goToHome} className="w-full">
                    <i className="fas fa-check mr-2"></i>
                    Done
                  </Button>
                  <button
                    onClick={() => setCurrentFlow('automatic')}
                    className="w-full text-center text-esimphony-gray hover:text-esimphony-black text-sm font-medium py-2 transition-colors"
                  >
                    Try automatic activation
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Success State */}
          {currentFlow === 'success' && (
            <Card className="text-center">
              <div className="p-8">
                <div className="w-24 h-24 bg-esimphony-success rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <i className="fas fa-check text-3xl text-white"></i>
                </div>
                
                <h2 className="text-2xl font-bold text-esimphony-black mb-4">
                  Activation Successful!
                </h2>
                <p className="text-esimphony-gray mb-8 leading-relaxed">
                  Your eSimphony plan is now active and ready to use. A confirmation QR code has also been sent to your email.
                </p>

                {/* Configuration Guidelines */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-start">
                    <i className="fas fa-info-circle text-esimphony-success mt-0.5 mr-2"></i>
                    <div className="text-sm">
                      <strong className="text-green-800">Final Setup Steps:</strong>
                      <div className="text-green-700 mt-1">
                        • Ensure <strong>Data Roaming</strong> is ON<br/>
                        • Set <strong>Mobile Data</strong> to eSIM profile by eSimphony<br/>
                        • Set <strong>APN</strong> to <strong>esimphony.flex</strong> in Mobile Data Network
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="primary" onClick={goToHome} className="w-full">
                  <i className="fas fa-home mr-2"></i>
                  Back to Home
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}